'use strict'

const jwt = require('jsonwebtoken')
const config = require('../../config')

const Service = require('../../base/Service')

class UserService extends Service {
  constructor(app) {
    super(UserService.name, app, [
      'id',
      'hashed_password',
      'created_at',
      'updated_at'
    ])
  }
  generateJWT(user) {
    return jwt.sign(
      {
        id: user.id,
        role: [user.get('role')]
      },
      config.get('privateKey'),
      { algorithm: 'RS256', expiresIn: '1h' }
    )
  }
  getAuthJSON(user, token) {
    return {
      ...this.toJSON(user),
      token: token || this.generateJWT(user)
    }
  }
  // getProfileJSON(user) {
  //   return this.toJSON(user, this.defaultFilter)
  //   // return {
  //   //   email: user.get('email'),
  //   //   role: user.get('role')
  //   // }
  // }
  // async getUsersJSON(
  //   { limit = 20, offset = 0, orderBy = '-created_at', role } = {},
  //   { trx } = {}
  // ) {
  //   const { models, pagination } = await this.fetchPage(
  //     { limit, offset, orderBy, role },
  //     { trx }
  //   )
  //   // return {}
  //   return {
  //     ...pagination,
  //     orderBy,
  //     users: await Promise.all(
  //       models.map(model => this.toJSON(model, this.defaultFilter))
  //     )
  //   }

  //   // return true

  //   // if (role) {
  //   //   const { models: users, pagination } = await model
  //   //     .where('role', '=', role)
  //   //     .orderBy(orderBy)
  //   //     .fetchPage({ limit, offset, transacting: trx })

  //   //   return {
  //   //     ...pagination,
  //   //     orderBy,
  //   //     users: await Promise.all(
  //   //       users.map(user =>
  //   //         this.toJSON(user, [
  //   //           'hashed_password',
  //   //           'password',
  //   //           'created_at',
  //   //           'updated_at'
  //   //         ])
  //   //       )
  //   //     )
  //   //   }
  //   // }
  //   // const { models: users, pagination } = await model
  //   //   .orderBy(orderBy)
  //   //   .fetchPage({ limit, offset, transacting: trx })
  //   // return {
  //   //   ...pagination,
  //   //   orderBy,
  //   //   users: await Promise.all(
  //   //     users.map(user =>
  //   //       this.toJSON(user, [
  //   //         'hashed_password',
  //   //         'password',
  //   //         'created_at',
  //   //         'updated_at'
  //   //       ])
  //   //     )
  //   //   )
  //   // }
  // }
}

module.exports = app => new UserService(app)

// module.exports = app => ({
//   async create(attributes, { trx } = {}) {
//     const {
//       locals: {
//         models: { User }
//       }
//     } = app
//     const user = new User(attributes)

//     const queryResult = await user.save(null, {
//       method: 'insert',
//       require: true,
//       transacting: trx
//     })
//     return queryResult
//   },
//   async fetch(attributes, { trx } = {}) {
//     const {
//       locals: {
//         models: { User }
//       }
//     } = app
//     const user = new User(attributes)

//     const queryResult = await user.fetch({
//       require: true,
//       transacting: trx
//     })
//     return queryResult
//   },
//   async destroy(user, { trx } = {}) {
//     const deleted = await user.destroy({
//       require: true,
//       transacting: trx
//     })
//     return deleted
//   },
//   async update(user, attributes, { trx } = {}) {
//     const updated = await user.save(attributes, {
//       method: 'update',
//       patch: true,
//       require: true,
//       transacting: trx
//     })
//     return updated
//   },
//   generateJWT(user) {
//     return jwt.sign(
//       {
//         id: user.id,
//         role: [user.get('role')]
//       },
//       config.get('privateKey'),
//       { algorithm: 'RS256', expiresIn: '1h' }
//     )
//   },
//   getAuthJSON(user, token) {
//     return {
//       email: user.get('email'),
//       token: token || this.generateJWT(user),
//       role: user.get('role')
//     }
//   },
//   getProfileJSON(user) {
//     return {
//       email: user.get('email'),
//       role: user.get('role')
//     }
//   },
//   async getUsersJSON(
//     { limit = 20, offset = 0, orderBy = '-created_at', role } = {},
//     { trx } = {}
//   ) {
//     const {
//       locals: {
//         models: { User }
//       }
//     } = app
//     const user = new User()

//     if (orderBy.length === 0) {
//       orderBy = '-created_at'
//     }

//     if (role) {
//       const { models: users, pagination } = await user
//         .where('role', '=', role)
//         .orderBy(orderBy)
//         .fetchPage({ limit, offset, transacting: trx })

//       return {
//         ...pagination,
//         orderBy,
//         users: await Promise.all(
//           users.map(user => ({
//             id: user.id,
//             ...this.getProfileJSON(user)
//           }))
//         )
//       }
//     }
//     const { models: users, pagination } = await user
//       .orderBy(orderBy)
//       .fetchPage({ limit, offset, transacting: trx })
//     return {
//       ...pagination,
//       orderBy,
//       users: await Promise.all(
//         users.map(user => ({
//           id: user.id,
//           ...this.getProfileJSON(user)
//         }))
//       )
//     }
//   }
//   // getProfileJSON(user, { trx } = {}) {
//   //   return {
//   //     name: user.get('name'),
//   //     username: user.get('username'),
//   //     image: user.get('image')
//   //   }
//   // }
//   // async getUsersJSON(
//   //   { limit = 20, offset = 0, orderBy = 'username' } = {},
//   //   { trx } = {}
//   // ) {
//   //   const {
//   //     locals: {
//   //       models: { User }
//   //     }
//   //   } = app
//   //   const user = new User()

//   //   if (orderBy.length === 0) {
//   //     orderBy = 'username'
//   //   }

//   //   const { models: users, pagination } = await user
//   //     .query('where', 'role', 'student')
//   //     .orderBy(orderBy)
//   //     .fetchPage({ limit, offset, transacting: trx })

//   //   const usersJSON = {
//   //     ...pagination,
//   //     orderBy,
//   //     users: await Promise.all(
//   //       users.map(async user => {
//   //         const userJSON = await app.locals.services.users.getProfileJSON(
//   //           user,
//   //           { trx }
//   //         )
//   //         return {
//   //           id: user.id,
//   //           ...userJSON
//   //         }
//   //       })
//   //     )
//   //   }
//   //   return usersJSON
//   // }
// })
