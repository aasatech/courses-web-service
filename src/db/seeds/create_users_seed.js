/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      name: 'user1',
      username: 'JoshSHiie',
      email: 'user1@gmail.com',
      password_encrypted: '1234567890'
    },
    {
      name: 'user2',
      username: 'Belloos',
      email: 'user2@gmail.com',
      password_encrypted: '1234567890'
    }
  ])
}
