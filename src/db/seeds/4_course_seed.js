const { faker } = require('@faker-js/faker')

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const createCourse = () => ({
  name: faker.lorem.words({ min: 3, max: 5 }),
  summary: faker.lorem.sentence(),
  category_id: randomNumber(1, 10),
  user_id: randomNumber(1, 5),
  image: '/uploads/' + randomNumber(1, 6) + '.jpg'
})

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('courses')
    .del()
    .then(async function () {
      const courses = []

      for (let i = 0; i < 80; i++) {
        courses.push(createCourse())
      }

      return await knex('courses').insert(courses)
    })
}
