const argon2 = require('argon2')
const students = require('../fixtures/students.json')
const lecturers = require('../fixtures/lecturers.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('users')
  await qb.del()

  const studentsData = await Promise.all(
    // eslint-disable-next-line
    students.map(async ({ user_id, identifier, name }) => ({
      id: user_id,
      email: `${identifier}@gmail.com`,
      role: 'student',
      hashed_password: await argon2.hash(`${identifier}123`, {
        type: argon2.argon2id
      })
    }))
  )
  const lecturersData = await Promise.all(
    // eslint-disable-next-line
    lecturers.map(async ({ user_id, identifier, name }, i) => ({
      id: user_id,
      email: `lecturer${i}@gmail.com`,
      role: 'lecturer',
      hashed_password: await argon2.hash(`lecturer${i}123`, {
        type: argon2.argon2id
      })
    }))
  )
  return qb.insert(
    [
      {
        email: 'admin@gmail.com',
        role: 'admin',
        hashed_password: await argon2.hash(`admin123`, {
          type: argon2.argon2id
        })
      },
      {
        email: 'device@gmail.com',
        role: 'device',
        hashed_password: await argon2.hash(`device123`, {
          type: argon2.argon2id
        })
      }
    ]
      .concat(studentsData)
      .concat(lecturersData)
  )
}
