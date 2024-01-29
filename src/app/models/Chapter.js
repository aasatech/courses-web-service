import { Model } from 'objection'

class Chapter extends Model {
  static get tableName () {
    return 'chapters'
  }

  // $formatJson (json) {
  //   json = super.$formatJson(json)

  //   delete json.created_at
  //   delete json.updated_at
  //   return json
  // }


  static get relationMappings () {
    return {
      lessons: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/Lesson',
        join: {
          from: 'chapters.id',
          to: 'lessons.chapter_id'
        }
      }
    }
  }
}

export default Chapter
