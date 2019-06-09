exports.up = function(knex, Promise) {
  return knex.schema.createTable('attendances', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.boolean('is_active').defaultTo(true)
    table.datetime('start_datetime').notNullable()
    table.datetime('end_datetime').notNullable()
    table.uuid('schedule_id').references('schedules.id')
    table.uuid('room_id').references('rooms.id')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('attendances')
}
