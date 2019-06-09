const rooms = require('../fixtures/rooms.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('rooms')
  await qb.del()
  return qb.insert(rooms)
}
