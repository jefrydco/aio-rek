exports.up = function(knex, Promise) {
  return knex.schema.createTable('schedules', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table
      .enum('day', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
      .notNullable()
    table.time('start_time').notNullable()
    table.time('end_time').notNullable()
    table
      .uuid('subject_id')
      .notNullable()
      .references('subjects.id')
      .onDelete('SET NULL')
    table
      .uuid('lecturer_id')
      .notNullable()
      .references('lecturers.id')
      .onDelete('SET NULL')
    table
      .uuid('room_id')
      .notNullable()
      .references('rooms.id')
      .onDelete('SET NULL')
    table
      .uuid('major_id')
      .notNullable()
      .references('majors.id')
      .onDelete('SET NULL')
    table
      .uuid('study_program_id')
      .notNullable()
      .references('study_programs.id')
      .onDelete('SET NULL')
    table
      .uuid('group_id')
      .notNullable()
      .references('groups.id')
      .onDelete('SET NULL')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('schedules')
}
