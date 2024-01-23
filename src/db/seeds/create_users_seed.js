/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      name: 'admin',
      username: 'GODTIEIDD',
      email: 'admin@gmail.com',
      password_encrypted:
        '$2a$12$2IjU7exlVMNkvDTj7cCA6.ATLI68sEfUF8D9sXxCk.OZl7Gr/Ny3W',
      role: 'admin'
    },
    {
      name: 'teacher',
      username: 'beslss isd',
      email: 'teacher@gmail.com',
      password_encrypted:
        '$2a$12$2IjU7exlVMNkvDTj7cCA6.ATLI68sEfUF8D9sXxCk.OZl7Gr/Ny3W',
      role: 'teacher'
    },
    {
      name: 'user1',
      username: 'JoshSHiie',
      email: 'user1@gmail.com',
      password_encrypted:
        '$2a$12$2IjU7exlVMNkvDTj7cCA6.ATLI68sEfUF8D9sXxCk.OZl7Gr/Ny3W'
    },
    {
      name: 'user2',
      username: 'Belloos',
      email: 'user2@gmail.com',
      password_encrypted:
        '$2a$12$2IjU7exlVMNkvDTj7cCA6.ATLI68sEfUF8D9sXxCk.OZl7Gr/Ny3W'
    }
  ])
}
