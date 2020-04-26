const schedules = require('../fixtures/schedules.json')

exports.seed = async function (knex, Promise) {
  const qb = knex('schedules')
  await qb.del()
  return qb.insert(schedules)
}
