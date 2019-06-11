exports.up = function(knex, Promise) {
  return knex.schema.createTable('presences', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.string('image').notNullable()
    table.boolean('is_late').defaultTo(false)
    table
      .uuid('student_id')
      .notNullable()
      .references('students.id')
      .onDelete('SET NULL')
    table
      .uuid('attendance_id')
      .notNullable()
      .references('attendances.id')
      .onDelete('SET NULL')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('presences')
}
