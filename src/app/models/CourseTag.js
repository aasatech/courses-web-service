import { Model } from 'objection'

class CourseTag extends Model {
  static get tableName () {
    return 'course_tags'
  }
}

export default CourseTag
