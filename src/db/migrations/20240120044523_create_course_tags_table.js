/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('course_tags', table=>{
    table.increments("id").primary()
    table.integer("course_id")
      .references("id")
      .inTable("courses")
    table.integer("tag_id")
      .references("id")
      .inTable("tags")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("course_tags")
};
