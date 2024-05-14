const { compare, hash } = require('bcryptjs');
const { format } = require('date-fns');
const z = require('zod');
const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class UsersController {
  async index(request, response) {
    const users = await knex('users');

    if (users.length === 0)
      throw new AppError('Usuários não encontrados!', 404);

    return response.json(users);
  }

  async show(request, response) {
    const { id } = request.params;

    const user = await knex('users').where({ id }).first();

    if (!user) throw new AppError('Usuário não encontrado!', 404);

    return response.json(user);
  }

  async create(request, response) {
    const { name, email, password, avatar } = request.body;

    if (!name || !email || !password)
      throw new AppError('Campos obrigatórios faltando!');

    const schema = z.string().email();
    const { success } = schema.safeParse(email);

    if (!success) throw new AppError('E-mail inválido!');

    const hashedPassword = await hash(password, 8);
    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    await knex('users').insert({
      name,
      email,
      password: hashedPassword,
      avatar,
      created_at: now,
      updated_at: now,
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, email, password, avatar } = request.body;

    const user = await knex('users').where({ id }).first();

    if (!user) throw new AppError('Usuário não encontrado!', 404);

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.avatar = avatar ?? user.avatar;
    user.updated_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    if (password.new && !password.old)
      throw new AppError('Informar a senha antiga!');

    if (!password.new && password.old)
      throw new AppError('Informar a senha nova!');

    if (password) {
      const checkOldPassword = await compare(password.old, user.password);

      if (!checkOldPassword) throw new AppError('Senha inválida!');

      const checkNewPassword = await compare(password.new, user.password);

      if (checkNewPassword) throw new AppError('A nova senha é igual à atual!');

      user.password = await hash(password.new, 8);
    }

    await knex('users').where({ id }).update(user);

    return response.json(user);
  }
}

module.exports = UsersController;
