exports.up = function (knex, Promise) {
  return knex.schema.createTable('majors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.string('name').notNullable()
    table
      .uuid('study_program_id')
      .references('study_programs.id')
      .onDelete('SET NULL')
    table
      .uuid('department_id')
      .references('departments.id')
      .onDelete('SET NULL')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('majors')
}
