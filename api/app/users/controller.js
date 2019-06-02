'use strict'

const ExtractJwt = require('passport-jwt').ExtractJwt
const errorCatcher = require('async-error-catcher').default

exports.create = errorCatcher(async (req, res) => {
  const { body: { user: { email, password, username, role } = {} } = {} } = req
  const {
    app: {
      locals: {
        services: { users }
      }
    },
    locals: { trx }
  } = res

  const user = await users.create(
    {
      email,
      image: '',
      username,
      role,
      password
    },
    { trx }
  )

  res.status(201).json({ user: users.getAuthJSON(user) })
})

exports.del = errorCatcher(async (req, res) => {
  const {
    app: {
      locals: {
        services: { users }
      }
    },
    locals: { user, trx } = {}
  } = res

  await users.del(user, { trx })
  res.sendStatus(200)
})

exports.login = errorCatcher((req, res) => {
  const { user } = req
  const {
    app: {
      locals: {
        services: { users }
      }
    }
  } = res

  res.json({ user: users.getAuthJSON(user) })
})

exports.getAll = errorCatcher(async (req, res) => {
  const { query: { limit, offset } = {} } = req
  const {
    app: {
      locals: {
        services: { users }
      }
    }
  } = res
  const usersJSON = { users: await users.getUsersJSON({ limit, offset }) }
  res.json(usersJSON)
})

exports.update = errorCatcher(async (req, res) => {
  const { body: { user: payload } = {}, user } = req
  const {
    app: {
      locals: {
        services: { users }
      }
    },
    locals: { trx }
  } = res

  const token = ExtractJwt.fromAuthHeaderWithScheme('Token')(req)
  const updatedUser = await users.update(user, payload, { trx })

  res.json({
    user: users.getAuthJSON(updatedUser, token)
  })
})

exports.getAuth = errorCatcher((req, res) => {
  const { user } = req
  const {
    app: {
      locals: {
        services: { users }
      }
    }
  } = res

  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)

  res.json({
    user: users.getAuthJSON(user, token)
  })
})

exports.getProfile = errorCatcher((req, res) => {
  const { user } = req
  const {
    app: {
      locals: {
        services: { users }
      }
    }
  } = res

  res.json({
    user: users.getProfileJSON(user)
  })
})

exports.getImages = errorCatcher(async (req, res) => {
  const { query: { limit, offset } = {}, user } = req
  const {
    app: {
      locals: {
        services: { images }
      }
    }
  } = res

  const imagesJSON = await images.getImagesJSON({ limit, offset }, user)
  return res.json(imagesJSON)
})
