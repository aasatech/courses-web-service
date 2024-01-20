import { Model } from "objection";
import bcrypt from "bcryptjs"

const saltRound = 12
class User extends Model{
  static get tableName(){
    return "users"
  }

  static generatePassword(password){
    return  bcrypt.hashSync(password, saltRound) 
  }

  comparePassword(password ){
    return bcrypt.compareSync( password,this.password_encrypted)
  }
}


export default User