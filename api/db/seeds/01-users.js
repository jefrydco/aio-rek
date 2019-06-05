'use strict'

const argon2 = require('argon2')
const users = require('../fixtures/users')

exports.seed = async function(knex, Promise) {
  const date = new Date().toUTCString()
  const qb = knex('users')
  await qb.del()
  const usersData = await Promise.all(
    users.map(async ({ nrp, name }, i) => {
      const hashedPassword = await argon2.hash(`${nrp}${i}`, {
        type: argon2.argon2id
      })
      return {
        email: `${nrp}@gmail.com`,
        hashed_password: hashedPassword,
        username: nrp,
        name,
        created_at: date,
        updated_at: date
      }
    })
  )
  const adminHashedPassword = await argon2.hash('admin123', {
    type: argon2.argon2id
  })
  const lecturerHashedPassword = await argon2.hash('lecturer123', {
    type: argon2.argon2id
  })
  return qb.insert(
    [
      {
        email: 'admin@gmail.com',
        hashed_password: adminHashedPassword,
        username: 'admin',
        name: 'Admin',
        role: 'admin',
        created_at: date,
        updated_at: date
      },
      {
        email: 'lecturer@gmail.com',
        hashed_password: lecturerHashedPassword,
        username: 'lecturer',
        name: 'Lecturer',
        role: 'lecturer',
        created_at: date,
        updated_at: date
      }
    ].concat(usersData)
  )
}
