'use strict'

const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = app => ({
  async create(attributes, { trx } = {}) {
    const {
      locals: {
        models: { User }
      }
    } = app
    const user = new User(attributes)

    const queryResult = await user.save(null, {
      method: 'insert',
      require: true,
      transacting: trx
    })
    return queryResult
  },
  async fetch(attributes, { trx } = {}) {
    const {
      locals: {
        models: { User }
      }
    } = app
    const user = new User(attributes)

    const queryResult = await user.fetch({
      require: true,
      transacting: trx
    })
    return queryResult
  },
  async destroy(user, { trx } = {}) {
    const deletedUser = await user.destroy({
      require: true,
      transacting: trx
    })
    return deletedUser
  },
  async update(user, attributes, { trx } = {}) {
    const updatedUser = await user.save(attributes, {
      method: 'update',
      patch: true,
      require: true,
      transacting: trx
    })
    return updatedUser
  },
  generateJWT(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.get('username'),
        role: [user.get('role')]
      },
      config.get('privateKey'),
      { algorithm: 'RS256', expiresIn: '1h' }
    )
  },
  getAuthJSON(user, token) {
    return {
      email: user.get('email'),
      image: user.get('image'),
      token: token || this.generateJWT(user),
      username: user.get('username'),
      role: user.get('role')
    }
  },
  getProfileJSON(user, { trx } = {}) {
    return {
      name: user.get('name'),
      username: user.get('username'),
      image: user.get('image')
    }
  },
  async getUsersJSON(
    { limit = 20, offset = 0, orderBy = 'username' } = {},
    { trx } = {}
  ) {
    const {
      locals: {
        models: { User }
      }
    } = app
    const user = new User()

    if (orderBy.length === 0) {
      orderBy = 'username'
    }

    const { models: users, pagination } = await user
      .query('where', 'role', 'student')
      .orderBy(orderBy)
      .fetchPage({ limit, offset, transacting: trx })

    const usersJSON = {
      ...pagination,
      orderBy,
      users: await Promise.all(
        users.map(async user => {
          const userJSON = await app.locals.services.users.getProfileJSON(
            user,
            { trx }
          )
          return {
            id: user.id,
            ...userJSON
          }
        })
      )
    }
    return usersJSON
  }
})
