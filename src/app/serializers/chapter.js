import dayjs from 'dayjs'
import { pick } from 'lodash'
import { lessonListSerializer } from './lesson'

export const chapterListSerializer = data => {
  data.created_at = dayjs(data.created_at).unix()
  data.updated_at = dayjs(data.updated_at).unix()
  data.lessons = data.lessons.map(lesson => {
    lessonListSerializer(lesson)
    return lesson
  })
  return pick(
    data,
    'id',
    'name',
    'summary',
    'created_at',
    'updated_at',
    'lessons'
  )
}
