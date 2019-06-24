const majors = require('../fixtures/majors.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('majors')
  await qb.del()
  return qb.insert(majors)
}
