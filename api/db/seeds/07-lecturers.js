const lecturers = require('../fixtures/lecturers.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('lecturers')
  await qb.del()
  const lecturersData = lecturers.map(
    // eslint-disable-next-line
    ({ id, user, identifier, name }) => ({
      id,
      identifier,
      name,
      user
    })
  )
  return qb.insert(lecturersData)
}
