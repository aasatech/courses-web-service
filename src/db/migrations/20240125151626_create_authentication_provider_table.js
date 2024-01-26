/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('authentication_provider', table => {
    table.string('provider_key').notNullable()
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('set null')
    table.enum('provider', ['google', 'facebook', 'github'])
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('authentication_provider')
}
