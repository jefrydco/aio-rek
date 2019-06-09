'use strict'

// const fs = require('fs')
// const ExtractJwt = require('passport-jwt').ExtractJwt
const errorCatcher = require('async-error-catcher').default
const Controller = require('../../base/Controller')

class UserController extends Controller {
  constructor() {
    super(UserController.name)
  }
  login(req, res, next) {
    return errorCatcher((req, res) => {
      const { user } = req
      const service = this._getService(res)
      return res.json({ user: service.getAuthJSON(user) })
    })(req, res, next)
  }
}

module.exports = new UserController()

// exports.login = errorCatcher((req, res) => {
//   const { user } = req
//   const {
//     app: {
//       locals: {
//         services: { users }
//       }
//     }
//   } = res

//   return res.json({ user: users.getAuthJSON(user) })
// })

// exports.create = errorCatcher(async (req, res) => {
//   const { body: { user: { email, password, role } = {} } = {} } = req
//   const {
//     app: {
//       locals: {
//         services: { users }
//       }
//     },
//     locals: { trx }
//   } = res

//   const user = await users.create(
//     {
//       email,
//       role,
//       password
//     },
//     { trx }
//   )

//   return res.status(201).json({ user: users.getAuthJSON(user) })
// })

exports.getAll = errorCatcher(async (req, res) => {
  const { query: { limit, offset, orderBy, role } = {} } = req
  const {
    app: {
      locals: {
        services: { users }
      }
    },
    locals: { trx }
  } = res
  return res.json({
    users: await users.getUsersJSON({ limit, offset, orderBy, role }, { trx })
  })
})

exports.getOnce = errorCatcher((req, res) => {
  const {
    app: {
      locals: {
        services: { users }
      }
    },
    locals: { user, trx }
  } = res

  return res.json({
    user: {
      id: user.id,
      ...users.getProfileJSON(user, { trx })
    }
  })
})

exports.update = errorCatcher(async (req, res) => {
  const {
    body: { user: payload }
  } = req
  const {
    app: {
      locals: {
        services: { users }
      }
    },
    locals: { user, trx }
  } = res

  const updatedUser = await users.update(user, payload, { trx })
  return res.json({ user: users.getProfileJSON(updatedUser) })
})

exports.destroy = errorCatcher(async (req, res) => {
  const {
    app: {
      locals: {
        services: { users }
      }
    },
    locals: { user, trx }
  } = res

  await users.destroy(user, { trx })
  await res.sendStatus(200)
})

// exports.update = errorCatcher(async (req, res) => {
//   const { body: payload = {}, file: { path } = {} } = req
//   const {
//     app: {
//       locals: {
//         services: { users }
//       }
//     },
//     locals: { user, trx }
//   } = res

//   let oldPath = user.get('image')
//   if (oldPath.length > 0) {
//     oldPath = `static/${oldPath}`
//     if (fs.existsSync(oldPath)) {
//       fs.unlinkSync(oldPath)
//     }
//   }
//   const updatedUser = await users.update(
//     user,
//     {
//       ...payload,
//       image: path ? path.replace('static', '') : ''
//     },
//     { trx }
//   )

//   res.json({
//     user: users.getProfileJSON(updatedUser)
//   })
// })

// exports.destroy = errorCatcher(async (req, res) => {
//   const {
//     app: {
//       locals: {
//         services: { users }
//       }
//     },
//     locals: { user, trx }
//   } = res

//   await users.destroy(user, { trx })
//   await res.sendStatus(200)
// })

// exports.updateSelf = errorCatcher(async (req, res) => {
//   const { body: { user: payload } = {}, user, file } = req
//   const {
//     app: {
//       locals: {
//         services: { users }
//       }
//     },
//     locals: { trx }
//   } = res

//   const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
//   const updatedUser = await users.update(user, payload, { trx })

//   console.log(file)

//   res.json({
//     user: users.getAuthJSON(updatedUser, token)
//   })
// })

// exports.getAuth = errorCatcher((req, res) => {
//   const { user } = req
//   const {
//     app: {
//       locals: {
//         services: { users }
//       }
//     }
//   } = res

//   const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)

//   res.json({
//     user: users.getAuthJSON(user, token)
//   })
// })

// exports.getProfile = errorCatcher((req, res) => {
//   const { user } = req
//   const {
//     app: {
//       locals: {
//         services: { users }
//       }
//     }
//   } = res

//   res.json({
//     user: users.getProfileJSON(user)
//   })
// })

// exports.getImages = errorCatcher(async (req, res) => {
//   const { query: { limit, offset, orderBy } = {}, user } = req
//   const {
//     app: {
//       locals: {
//         services: { images }
//       }
//     },
//     locals: { trx }
//   } = res

//   const imagesJSON = await images.getImagesJSON(
//     { limit, offset, orderBy, owner: user.id },
//     { trx }
//   )
//   return res.json(imagesJSON)
// })
