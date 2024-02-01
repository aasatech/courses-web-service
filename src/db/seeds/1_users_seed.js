const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')


const fromDate = new Date ('2020-01-30')
const toDate = new Date ('2024-01-30')

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

const deleteUser = () => ({
  name: faker.internet.displayName(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password_encrypted: bcrypt.hashSync('1234567890', saltRound),
  role: 'student',
  deleted_at: dayjs(faker.date.between({from:fromDate,to:toDate})).format()
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
      for (let i = 0; i < 5; i++) {
        users.push(deleteUser())
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
