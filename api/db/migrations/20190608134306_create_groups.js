exports.up = function(knex, Promise) {
  return knex.schema.createTable('groups', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table
      .string('name')
      .unique()
      .notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('groups')
}
