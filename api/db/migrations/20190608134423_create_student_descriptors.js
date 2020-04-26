exports.up = function (knex, Promise) {
  return knex.schema.createTable('student_descriptors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.jsonb('descriptor').notNullable()
    table
      .uuid('student_image_id')
      .notNullable()
      .references('student_images.id')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('student_descriptors')
}
