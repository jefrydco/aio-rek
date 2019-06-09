exports.up = function(knex, Promise) {
  return knex.raw('create extension if not exists "uuid-ossp"')
}

exports.down = function(knex, Promise) {
  return knex.raw('drop extension if exists "uuid-ossp"')
}
