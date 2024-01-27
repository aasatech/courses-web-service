const { faker } = require('@faker-js/faker')

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const createLesson = () => ({
  name: faker.lorem.words({ min: 3, max: 5 }),
  content: faker.lorem.text(),
  image: '/uploads/' + randomNumber(1, 6) + '.jpg',
  chapter_id: randomNumber(1, 300)
})

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('lessons')
    .del()
    .then(async function () {
      const lessons = []

      for (let i = 0; i < 1000; i++) {
        lessons.push(createLesson())
      }

      return await knex('lessons').insert(lessons)
    })
}
