const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

const saltRound = 12
const createTeacher = () => ({
  name: faker.internet.displayName(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password_encrypted: bcrypt.hashSync('1234567890', saltRound),
  role: 'teacher'
})

const createStudent = () => ({
  name: faker.internet.displayName(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password_encrypted: bcrypt.hashSync('1234567890', saltRound),
  role: 'student'
})

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users')
    .del()
    .then(async function () {
      const users = []
      for (let i = 0; i < 5; i++) {
        users.push(createTeacher())
      }
      for (let i = 0; i < 20; i++) {
        users.push(createStudent())
      }
      return await knex('users').insert(users)
    })
  await knex('users').insert([
    {
      name: 'admin',
      username: 'GOD_TEIR_ADMIN',
      email: 'admin@gmail.com',
      password_encrypted:
        '$2a$12$2IjU7exlVMNkvDTj7cCA6.ATLI68sEfUF8D9sXxCk.OZl7Gr/Ny3W',
      role: 'admin'
    }
  ])
}
