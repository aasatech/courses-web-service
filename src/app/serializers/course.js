import dayjs from 'dayjs'
import { pick } from 'lodash'

export const listSerializer = data => {
  data.date = dayjs(data.created_at).unix()
  data.image_url = data.imageUrl
  return pick(data, 'id', 'name', 'summary', 'date', 'image_url')
}

export const showSerializer = data => {}
