import { Model } from 'objection'

class Category extends Model {
  static get tableName () {
    return 'categories'
  }

  static get softDelete () {
    return true
  }
}

export default Category
