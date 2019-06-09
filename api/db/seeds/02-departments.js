const departments = require('../fixtures/departments.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('departments')
  await qb.del()
  return qb.insert(departments)
}
