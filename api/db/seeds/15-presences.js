const presences = require('../fixtures/presences.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('presences')
  await qb.del()
  return qb.insert(presences)
}
