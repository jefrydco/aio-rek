'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('descriptors', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps()
    table.jsonb('descriptor').notNullable()
    table
      .uuid('image')
      .notNullable()
      .references('images.id')
      .onDelete('CASCADE')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('descriptors')
}
