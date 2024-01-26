import { Model } from 'objection'

class Course extends Model {
  static get tableName () {
    return 'courses'
  }

  static modifiers = {
    defaultSelects (query) {
      query.select('id', 'name', 'summary', 'image', 'created_at', 'updated_at')
    },

    filterCategories (query, categoryIds) {
      if (categoryIds.length > 0) query.whereIn('category_id', categoryIds)
    },

    filterTags (query, tags) {
      if (tags.length > 0) query.joinRelated('tags').whereIn('tags.id', tags)
    },

    orderByDate (query, order) {
      if (order) query.orderBy('id', order)
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
