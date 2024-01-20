import { Model } from "objection";

class Lesson extends Model{
  static get tableName(){
    return "lessons"
  }
}

export default Lesson