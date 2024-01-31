import { Model } from 'objection'

class Lesson extends Model {
  static get tableName () {
    return 'lessons'
  }
  $formatJson (json) {
    json = super.$formatJson(json)

    // delete json.image
    delete json.created_at
    delete json.updated_at
    return json
  }

  get imageUrl () {
    if(this.image){
      return `${process.env.BASE_STORAGE_URL}${this.image}`
    }

    return null
    
  }

  get videoUrl () {
    if(this.video){
      return `${process.env.BASE_STORAGE_URL}${this.video}`
    }

    return null
  }
}

export default Lesson
