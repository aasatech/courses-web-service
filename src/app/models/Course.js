import { Model } from "objection";

class Course extends Model{
  static get tableName(){
    return "courses"
  }

  static get relationMappings(){
    return{
      chapters: {
        relation: Model.HasManyRelation,
        modelClass: __dirname+"/Chapter",
        join: {
          from: "courses.id",
          to: "chapters.course_id"
        }
      },
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname+"/Tag",
        join: {
          from: "courses.id",
          through: {
            from: "course_tags.course_id",
            to: "course_tags.tag_id"
          },
          to: "tags.id"
        }
      }
    }
  }
}

export default Course