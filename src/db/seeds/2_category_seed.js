const { faker } = require('@faker-js/faker')

const createCategory = () => ({
  name: faker.lorem.words({ min: 1, max: 2 }),
  slug: faker.lorem.slug({ min: 1, max: 2 })
})

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('categories')
    .del()
    .then(async function () {
      const categories = []

      for (let i = 0; i < 20; i++) {
        categories.push(createCategory())
      }

      return await knex('categories').insert(categories)
    })
}
