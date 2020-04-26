exports.up = function (knex, Promise) {
  return knex.schema.createTable('attendances', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.string('image').notNullable().defaultTo('')
    table.boolean('is_active').defaultTo(true)
    table.datetime('start_datetime').defaultTo(knex.fn.now())
    table.datetime('end_datetime')
    table.uuid('schedule_id').references('schedules.id').onDelete('SET NULL')
    table.uuid('room_id').references('rooms.id').onDelete('SET NULL')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('attendances')
}
