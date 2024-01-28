import { Model } from 'objection'

class Tag extends Model {
  static get tableName () {
    return 'tags'
  }

  static modifiers = {
    defaultSelects (query) {}
  }

  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.deleted_at
    delete json.created_at
    delete json.updated_at
    return json
  }

  static get softDelete () {
    return true
  }

  static get relationMappings () {
    return {
      courses: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/CourseTag',
        join: {
          from: 'tags.id',
          to: 'course_tags.tag_id'
        }
      }
    }
  }
}

export default Tag
