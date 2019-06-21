const studentDescriptors = require('../fixtures/student-descriptors.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('student_descriptors')
  await qb.del()
  return qb.insert(studentDescriptors)
}
