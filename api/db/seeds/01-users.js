'use strict'

const argon2 = require('argon2')
const users = require('../fixtures/users')

exports.seed = async function(knex, Promise) {
  const date = new Date().toUTCString()
  const qb = knex('users')
  await qb.del()

  const lecturersData = await Promise.all(
    Array.from({ length: 3 }, async (v, k) => ({
      email: `lecturer-${k}@gmail.com`,
      hashed_password: await argon2.hash(`lecturer-${k}123`, {
        type: argon2.argon2id
      }),
      username: `lecturer-${k}`,
      name: `Lecturer ${k}`,
      role: 'lecturer',
      created_at: date,
      updated_at: date
    }))
  )
  const roomsData = await Promise.all(
    Array.from({ length: 3 }, async (v, k) => ({
      email: `room-${k}@gmail.com`,
      hashed_password: await argon2.hash(`room-${k}123`, {
        type: argon2.argon2id
      }),
      username: `room-${k}`,
      name: `Room ${k}`,
      role: 'room',
      created_at: date,
      updated_at: date
    }))
  )
  const usersData = await Promise.all(
    users.map(async ({ nrp, name }, i) => {
      return {
        email: `${nrp}@gmail.com`,
        hashed_password: await argon2.hash(`${nrp}123`, {
          type: argon2.argon2id
        }),
        username: nrp,
        name,
        created_at: date,
        updated_at: date
      }
    })
  )
  return qb.insert(
    [
      {
        email: 'admin@gmail.com',
        hashed_password: await argon2.hash('admin123', {
          type: argon2.argon2id
        }),
        username: 'admin',
        name: 'Admin',
        role: 'admin',
        created_at: date,
        updated_at: date
      }
    ]
      .concat(lecturersData)
      .concat(roomsData)
      .concat(usersData)
  )
}
