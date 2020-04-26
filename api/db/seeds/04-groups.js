const groups = require('../fixtures/groups.json')

exports.seed = async function (knex, Promise) {
  const qb = knex('groups')
  await qb.del()
  return qb.insert(groups)
}
