const students = require('../fixtures/students.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('students')
  await qb.del()
  const studentsData = students.map(
    // eslint-disable-next-line
    ({ id, user, identifier, name, study_program, class: cls }) => ({
      id,
      identifier,
      name,
      study_program,
      class: cls,
      user
    })
  )
  return qb.insert(studentsData)
}
