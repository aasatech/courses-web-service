import dayjs from 'dayjs'
import { pick } from 'lodash'

export const lessonListSerializer = data => {
  data.image_url = data.imageUrl
  data.created_at = dayjs(data.created_at).unix()
  data.updated_at = dayjs(data.updated_at).unix()
  return pick(
    data,
    'id',
    'name',
    'content',
    'image_url',
    'created_at',
    'updated_at'
  )
}
