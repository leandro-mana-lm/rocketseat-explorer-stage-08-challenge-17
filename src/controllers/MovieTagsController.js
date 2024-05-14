const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class MovieTagsController {
  async index(request, response) {
    const movie_tags = await knex('movie_tags').orderBy('note_id', 'id');

    if (movie_tags.length === 0) throw AppError('Tags não encontradas!', 404);

    return response.json(movie_tags);
  }

  async show(request, response) {
    const { note_id } = request.params;

    const movie_tags = await knex('movie_tags')
      .where({ note_id })
      .orderBy('id');

    if (movie_tags.length === 0)
      throw new AppError('Tags não encontradas!', 404);

    return response.json(movie_tags);
  }
}

module.exports = MovieTagsController;
