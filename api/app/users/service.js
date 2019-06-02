'use strict'

const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = app => ({
  async create(attributes, { trx } = {}) {
    const user = await app.locals.models.User.forge(attributes).save(null, {
      method: 'insert',
      require: true,
      transacting: trx
    })
    return user
  },
  async fetch(attributes, { trx } = {}) {
    const user = await app.locals.models.User.forge(attributes).fetch({
      require: true,
      transacting: trx
    })
    return user
  },
  async del(user, { trx } = {}) {
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
      username: user.get('username')
    }
  },
  getProfileJSON(user, { trx } = {}) {
    return {
      name: user.get('name'),
      username: user.get('username'),
      image: user.get('image')
    }
  },
  async getUsersJSON({ limit = 20, offset = 0 } = {}, { trx } = {}) {
    const { models: users, pagination } = await app.locals.models.User.forge()
      .query('where', 'role', 'student')
      .fetchPage({ limit, offset, transacting: trx })

    const usersJSON = {
      ...pagination,
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
