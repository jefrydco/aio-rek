exports.up = function(knex, Promise) {
  return knex.schema.createTable('presences', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.string('image').notNullable()
    table.uuid('student').references('students.id')
    table.uuid('attendance').references('attendances.id')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('presences')
}
