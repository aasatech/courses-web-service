/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable('contacts', table => {
    table.increments('id').primary(),
      table.string('name'),
      table.string('email'),
      table.text('comment'),
      // table
      //   .integer('user_id')
      //   .references('id')
      //   .inTable('users')
      //   .onDelete('CASCADE')
      table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.createTable('contacts')
}
