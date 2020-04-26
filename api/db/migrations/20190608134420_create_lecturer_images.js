exports.up = function (knex, Promise) {
  return knex.schema.createTable('lecturer_images', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.string('path').notNullable()
    table.boolean('has_descriptor').defaultTo(false)
    table
      .uuid('lecturer_id')
      .notNullable()
      .references('lecturers.id')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('lecturer_images')
}
