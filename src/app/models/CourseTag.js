import { Model } from 'objection'

class CourseTag extends Model {
  static get tableName () {
    return 'course_tags'
  }

  static get relationMappings () {
    return {
      courseTags: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Tag'
      }
    }
  }
}

export default CourseTag
