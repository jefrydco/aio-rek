const subjects = require('../fixtures/subjects.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('subjects')
  await qb.del()
  return qb.insert(subjects)
}
