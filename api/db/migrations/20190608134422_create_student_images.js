exports.up = function (knex, Promise) {
  return knex.schema.createTable('student_images', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.string('path').notNullable()
    table.boolean('has_descriptor').defaultTo(false)
    table
      .uuid('student_id')
      .notNullable()
      .references('students.id')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('student_images')
}
