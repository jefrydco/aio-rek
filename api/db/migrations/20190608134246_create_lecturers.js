exports.up = function(knex, Promise) {
  return knex.schema.createTable('lecturers', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.string('name').notNullable()
    table
      .string('identifier')
      .unique()
      .notNullable()
    table.string('image').defaultTo('')
    table.boolean('is_active').defaultTo(true)
    table
      .uuid('user_id')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('lecturers')
}
