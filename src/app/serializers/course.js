import dayjs from 'dayjs'
import { pick } from 'lodash'
import { chapterListSerializer } from './chapter'

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
    chapterListSerializer(chapter)
    return chapter
  })

  return pick(
    data,
    'id',
    'name',
    'summary',
    'image_url',
    'created_at',
    'updated_at',
    'tags',
    'user',
    'category',
    'chapters'
  )
}
