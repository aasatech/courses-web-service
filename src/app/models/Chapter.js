import { Model } from "objection";

class Chapter extends Model{
  static get tableName(){
    return "chapters"
  }

  static get relationMappings(){
    return{
      lessons: {
        relation: Model.HasManyRelation,
        modelClass: __dirname+"/Lesson",
        join: {
          from: "chapters.id",
          to: "lessons.chapter_id"
        }
      },
    }
  }
}

export default Chapter