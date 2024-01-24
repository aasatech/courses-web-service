import { Model } from 'objection'

class Tag extends Model {
  static get tableName () {
    return 'tags'
  }

  static get softDelete () {
    return true
  }
}

export default Tag
