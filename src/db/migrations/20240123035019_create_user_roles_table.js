/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_roles', table => {
    table.increments('id').primary()
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
    table
      .integer('role_id')
      .references('id')
      .inTable('roles')
      .onDelete('cascade')
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_roles')
}
