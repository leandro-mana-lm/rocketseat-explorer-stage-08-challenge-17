const { format } = require('date-fns');
const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class MovieNotesController {
  async index(request, response) {
    const movies = await knex('movie_notes');

    if (movies.length === 0)
      throw new AppError('Notas de filmes não encontradas!', 404);

    return response.json(movies);
  }

  async show(request, response) {
    const { id } = request.params;

    const movie_note = await knex('movie_notes').where({ id }).first();

    if (!movie_note) throw new AppError('Nota de filme não encontrada!', 404);

    return response.json(movie_note);
  }

  async create(request, response) {
    const { notes, tags, user_id } = request.body;

    if (!notes) throw new AppError('Detalhes da nota do filme inválidos!');

    if (!tags || tags.length === 0) throw new AppError('Tags não informadas!');

    const { title, description, rating } = notes;

    if (!title || !description || !rating || !user_id)
      throw new AppError('Campos obrigatórios faltando!');

    if (rating < 1 || rating > 5)
      throw new AppError('A nota deve ser entre 1 e 5!');

    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const [note_id] = await knex('movie_notes').insert({
      ...notes,
      user_id,
      created_at: now,
      updated_at: now,
    });

    tags.forEach(
      async (name) =>
        await knex('movie_tags').insert({
          note_id,
          user_id,
          name,
        })
    );

    const insertedTags = await knex('movie_tags').where({ note_id });

    return response.status(201).json({
      note_id,
      ...notes,
      tags: insertedTags,
    });
  }

  async update(request, response) {
    const { id } = request.params;
    const { title, description, rating } = request.body;

    const movie = await knex('movie_notes').where({ id }).first();

    if (!movie) throw new AppError('Nota não encontrada!', 404);

    movie.title = title ?? movie.title;
    movie.description = description ?? movie.description;
    movie.rating = rating ?? movie.rating;
    movie.updated_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    await knex('movie_notes').where({ id }).update(movie);

    return response.json(movie);
  }

  async delete(request, response) {
    const { id } = request.params;

    const movie_note = await knex('movie_notes').where({ id }).first();

    if (!movie_note) throw new AppError('Nota de filme não encontrada!', 404);

    await knex('movie_notes').where({ id }).delete();

    return response.status(204).json();
  }
}

module.exports = MovieNotesController;
