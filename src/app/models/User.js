import { Model } from 'objection'
import bcrypt from 'bcryptjs'

const saltRound = 12
class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get softDelete () {
    return true
  }

  static modifiers = {
    filter (query, data) {
      if (data) {
        query
          .whereLike('name', `%${data}%`)
          .orWhereLike('username', `%${data}%`)
          .orWhereLike('email', `%${data}%`)
      }
    }
  }

  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.password_encrypted
    delete json.created_at
    delete json.updated_at
    delete json.deleted_at
    return json
  }

  static generatePassword (password) {
    return bcrypt.hashSync(password, saltRound)
  }

  comparePassword (password) {
    return bcrypt.compareSync(password, this.password_encrypted)
  }
}

export default User
