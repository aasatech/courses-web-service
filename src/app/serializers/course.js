import dayjs from 'dayjs'
import { pick } from 'lodash'

const convertDate = date => {
  return dayjs(date).unix()
}

export const listSerializer = data => {
  data.created_at = convertDate(data.created_at)
  data.image_url = data.imageUrl
  return pick(data, 'id', 'name', 'summary', 'created_at', 'image_url')
}

export const showSerializer = data => {
  data.image_url = data.imageUrl
  data.created_at = convertDate(data.created_at)
  data.updated_at = convertDate(data.updated_at)
  data.chapters = data.chapters.map(chapter => {
    chapter.created_at = convertDate(data.created_at)
    chapter.updated_at = convertDate(data.updated_at)

    chapter.lessons = chapter.lessons.map(lesson => {
      lesson.created_at = convertDate(data.created_at)
      lesson.updated_at = convertDate(data.updated_at)
      lesson.image_url = lesson.imageUrl
      return pick(
        lesson,
        'id',
        'name',
        'chapter_id',
        'content',
        'image_url',
        'created_at',
        'updated_at'
      )
    })
    return pick(
      chapter,
      'id',
      'name',
      'summary',
      'course_id',
      'image_url',
      'created_at',
      'updated_at',
      'lessons'
    )
  })

  return pick(
    data,
    'id',
    'name',
    'summary',
    'created_at',
    'updated_at',
    'image_url',
    'chapters',
    'tags',
    'category',
    'user'
  )
}
