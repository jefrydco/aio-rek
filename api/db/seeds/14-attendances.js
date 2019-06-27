const attendances = require('../fixtures/attendances.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('attendances')
  await qb.del()
  return qb.insert(attendances)
}
