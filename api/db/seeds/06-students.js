const students = require('../fixtures/students.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('students')
  await qb.del()
  const studentsData = students.map(
    // eslint-disable-next-line
    ({ id, user_id, identifier, name, study_program_id, class_id }) => ({
      id,
      identifier,
      name,
      study_program_id,
      class_id,
      user_id
    })
  )
  return qb.insert(studentsData)
}
