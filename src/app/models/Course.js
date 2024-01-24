import { Model } from 'objection'

class Course extends Model {
  static get tableName () {
    return 'courses'
  }

  static modifiers = {
    defaultSelects (query) {
      query.select('id', 'name', 'summary', 'image', 'created_at', 'updated_at')
    },

    filterCategories (query, category_id) {
      query.whereIn('category_id', category_id)
    },

    filterTags (query, tags) {
      query.joinRelated('tags').whereIn('tags.id', tags)
    },

    orderByDate (query, order) {
      query.orderBy('id', order)
    }
  }

  static get relationMappings () {
    return {
      category: {
        relation: Model.HasOneRelation,
        modelClass: __dirname + '/Category',
        join: {
          from: 'courses.category_id',
          to: 'categories.id'
        }
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: __dirname + '/User',
        join: {
          from: 'courses.user_id',
          to: 'users.id'
        }
      },

      chapters: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/Chapter',
        join: {
          from: 'courses.id',
          to: 'chapters.course_id'
        }
      },
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Tag',
        join: {
          from: 'courses.id',
          through: {
            from: 'course_tags.course_id',
            to: 'course_tags.tag_id'
          },
          to: 'tags.id'
        }
      }
    }
  }
}

export default Course
