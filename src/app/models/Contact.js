import { Model } from 'objection'

class Contact extends Model {
  static get tableName () {
    return 'contacts'
  }
}

export default Contact
