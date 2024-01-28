import { Model } from 'objection'

class CourseTag extends Model {
  static get tableName () {
    return 'course_tags'
  }

  static get relationMappings () {
    return {
      course: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Course',
        join: {
          from: 'course_tags.course_id',
          to: 'courses.id'
        }
      },
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Tag',
        join: {
          from: 'course_tags.tag_id',
          to: 'tags.id'
        }
      }
    }
  }
}

export default CourseTag
