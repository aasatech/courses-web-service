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

  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.deleted_at
    delete json.password_encrypted
    delete json.created_at
    delete json.updated_at
    return json
  }

  static generatePassword (password) {
    return bcrypt.hashSync(password, saltRound)
  }

  comparePassword (password) {
    return bcrypt.compareSync(password, this.password_encrypted)
  }

  static get relationMappings () {
    return {
      providers: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/AuthenticationProvider',
        join: {
          from: 'users.id',
          to: 'authentication_provider.user_id'
        }
      }
    }
  }
}

export default User
