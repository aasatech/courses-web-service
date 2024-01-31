import 'dotenv/config'
import { Model } from 'objection'

class Course extends Model {
  static get tableName () {
    return 'courses'
  }

  get imageUrl () {
    return `${process.env.BASE_STORAGE_URL}${this.image}`
  }

  static modifiers = {
    filterCategories (query, categoryIds) {
      if (categoryIds.length > 0) query.whereIn('category_id', categoryIds)
    },

    filterTags (query, tags) {
      if (tags.length > 0) {
        query.whereExists(function () {
          this.select('*')
            .from('course_tags')
            .whereRaw('course_tags.course_id = courses.id')
            .whereIn('course_tags.tag_id', tags)
        })
      }
    },

    orderByDate (query, order) {
      if (order) query.orderBy('id', order)
    },

    searchCourse (query, searchData) {
      if (searchData) {
        query.whereLike('name', `%${searchData}%`)
      }
    },

    filterDate (query, fromDate, toDate) {
      if (fromDate && !toDate) {
        query.where('created_at', new Date(fromDate).toISOString())
      }
      if (fromDate && toDate) {
        query.whereBetween('created_at', [
          new Date(fromDate).toISOString(),
          new Date(toDate).toISOString()
        ])
      }
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
