'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('images', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps()
    table.string('path').notNullable()
    table.jsonb('descriptor').notNullable()
    table
      .uuid('owner')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('images')
}
