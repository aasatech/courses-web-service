/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('categories').del()
  await knex('categories').insert([
    {name: 'cate1', slug: "cate1"},
    {name: 'cate2', slug: "cate2"},
    {name: 'cate3', slug: "cate3"}
  ]);
};
