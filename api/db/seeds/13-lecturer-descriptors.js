const lecturerDescriptors = require('../fixtures/lecturer-descriptors.json')

exports.seed = async function (knex, Promise) {
  const qb = knex('lecturer_descriptors')
  await qb.del()
  return qb.insert(lecturerDescriptors)
}
