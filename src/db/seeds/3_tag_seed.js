const { faker } = require('@faker-js/faker')
const createTag = () => ({
  name: faker.lorem.word(5)
})

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('tags')
    .del()
    .then(async function () {
      const tags = []

      for (let i = 0; i < 20; i++) {
        tags.push(createTag())
      }
      return await knex('tags').insert(tags)
    })
}
