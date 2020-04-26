const lecturers = require('../fixtures/lecturers.json')

exports.seed = async function (knex, Promise) {
  const qb = knex('lecturers')
  await qb.del()
  return qb.insert(lecturers)
}
