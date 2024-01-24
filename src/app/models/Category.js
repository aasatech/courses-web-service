import { Model } from 'objection'

class Category extends Model {
  static get tableName () {
    return 'categories'
  }

  static get softDelete () {
    return true
  }

  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.deleted_at
    delete json.created_at
    delete json.updated_at
    return json
  }

  // static get relationMappings(){
  //   return{

  //   }
  // }
}

export default Category
