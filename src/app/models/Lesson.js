import { Model } from 'objection'

class Lesson extends Model {
  static get tableName () {
    return 'lessons'
  }
  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.image
    delete json.created_at
    delete json.updated_at
    delete json.video
    return json
  }

  get imageUrl () {
    if(!this.image){
      return null
    }
    return `${process.env.BASE_STORAGE_URL}${this.image}`
    
  }

  get videoUrl () {
    if(!this.video){
      return null
    }
    return `${process.env.BASE_STORAGE_URL}${this.video}`
    
  }
}

export default Lesson
