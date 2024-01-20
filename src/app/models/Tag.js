import { Model } from "objection";

class Tag extends Model{
  static get tableName(){
    return "tags"
  }
}

export default Tag