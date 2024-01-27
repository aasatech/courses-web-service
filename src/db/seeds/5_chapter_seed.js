const { faker } = require('@faker-js/faker')

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const createChapter = () => ({
  name: faker.lorem.words({ min: 3, max: 5 }),
  summary: faker.lorem.sentence(),
  course_id: randomNumber(1, 80)
})

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('chapters')
    .del()
    .then(async function () {
      const chapters = []

      for (let i = 0; i < 300; i++) {
        chapters.push(createChapter())
      }

      return await knex('chapters').insert(chapters)
    })
}
