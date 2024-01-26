/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('courses', table => {
    table.increments('id').primary()
    table.string('name')
    table.text('summary')
    table.string('image')
    table
      .integer('category_id')
      .references('id')
      .inTable('categories')
      .onDelete('set null')
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('courses')
}
