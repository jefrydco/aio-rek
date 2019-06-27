exports.up = function(knex, Promise) {
  return knex.schema.createTable('rooms', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table
      .string('name')
      .unique()
      .notNullable()
    table.boolean('in_use').defaultTo(false)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('rooms')
}
