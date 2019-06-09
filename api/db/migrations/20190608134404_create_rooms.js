exports.up = function(knex, Promise) {
  return knex.schema.createTable('rooms', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.string('name').notNullable()
    table.boolean('in_use').defaultTo(false)
    table
      .uuid('user')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('rooms')
}
