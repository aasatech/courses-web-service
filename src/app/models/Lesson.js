import { Model } from 'objection'

class Lesson extends Model {
  static get tableName () {
    return 'lessons'
  }
  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.created_at
    delete json.updated_at
    return json
  }
}

export default Lesson
