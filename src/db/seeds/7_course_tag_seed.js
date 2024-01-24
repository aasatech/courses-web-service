const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const createCourseTag = () => ({
  course_id: randomNumber(1, 30),
  tag_id: randomNumber(1, 30)
})

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('course_tags')
    .del()
    .then(async function () {
      const course_tags = []

      for (let i = 0; i < 100; i++) {
        course_tags.push(createCourseTag())
      }

      return await knex('course_tags').insert(course_tags)
    })
}