'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps()
    table
      .string('username')
      .notNullable()
      .unique()
    table
      .string('email')
      .notNullable()
      .unique()
    table.enum('role', ['admin', 'student']).defaultTo('student')
    table.string('hashed_password').notNullable()
    table.string('image').defaultTo('')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}
