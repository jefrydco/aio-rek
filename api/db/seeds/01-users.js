const argon2 = require('argon2')
const students = require('../fixtures/students.json')
const lecturers = require('../fixtures/lecturers.json')
const rooms = require('../fixtures/rooms.json')

exports.seed = async function(knex, Promise) {
  const qb = knex('users')
  await qb.del()

  const studentsData = await Promise.all(
    students.map(async ({ user, identifier, name }) => ({
      id: user,
      email: `${identifier}@gmail.com`,
      role: 'student',
      hashed_password: await argon2.hash(`${identifier}123`, {
        type: argon2.argon2id
      })
    }))
  )
  const lecturersData = await Promise.all(
    lecturers.map(async ({ user, identifier, name }, i) => ({
      id: user,
      email: `lecturer${i}@gmail.com`,
      role: 'lecturer',
      hashed_password: await argon2.hash(`lecturer${i}123`, {
        type: argon2.argon2id
      })
    }))
  )
  const roomsData = await Promise.all(
    rooms.map(async ({ user, name }, i) => ({
      id: user,
      email: `${name
        .replace(/[^\w\s]/gi, '')
        .replace(' ', '')
        .toLowerCase()}@gmail.com`,
      role: 'room',
      hashed_password: await argon2.hash(
        `${name
          .replace(/[^\w\s]/gi, '')
          .replace(' ', '')
          .toLowerCase()}123`,
        {
          type: argon2.argon2id
        }
      )
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
      }
    ]
      .concat(studentsData)
      .concat(lecturersData)
      .concat(roomsData)
  )
}
