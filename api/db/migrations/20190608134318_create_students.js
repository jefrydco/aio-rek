exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(true, true)
    table.string('name').notNullable()
    table
      .string('identifier')
      .unique()
      .notNullable()
    table.string('image')
    table.boolean('is_active').defaultTo(true)
    table
      .uuid('user_id')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
    table
      .uuid('study_program_id')
      .references('study_programs.id')
      .onDelete('SET NULL')
    table
      .uuid('group_id')
      .references('groups.id')
      .onDelete('SET NULL')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('students')
}
