import { Model } from 'objection'

class AuthProvider extends Model {
  static get tableName () {
    return 'authentication_provider'
  }

  static get idColumn () {
    return 'provider_key'
  }
}

export default AuthProvider
