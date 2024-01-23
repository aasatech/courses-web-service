import { Model } from 'objection'

class UserRole extends Model {
  static get tableName () {
    return 'user_roles'
  }
}

export default UserRole
