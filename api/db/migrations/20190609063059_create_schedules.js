exports.up = function(knex, Promise) {
  return knex.schema.createTable('schedules', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.enum('day', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
    table.time('start_time').notNullable()
    table.time('end_time').notNullable()
    table
      .uuid('subject_id')
      .references('subjects.id')
      .onDelete('SET NULL')
    table
      .uuid('lecturer_id')
      .references('lecturers.id')
      .onDelete('SET NULL')
    table
      .uuid('room_id')
      .references('rooms.id')
      .onDelete('SET NULL')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('schedules')
}
