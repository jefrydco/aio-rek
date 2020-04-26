const students = require('../fixtures/students.json')

exports.seed = async function (knex, Promise) {
  const qb = knex('students')
  await qb.del()
  return qb.insert(students)
}
