exports.up = function(knex, Promise) {
  return knex.schema.createTable('lecturer_descriptors', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.jsonb('descriptor').notNullable()
    table
      .uuid('lecturer_image_id')
      .notNullable()
      .references('lecturer_images.id')
      .onDelete('CASCADE')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('lecturer_descriptors')
}
