'use strict'

const errorCatcher = require('async-error-catcher').default

exports.handleId = errorCatcher(async (req, res, next) => {
  const {
    app: {
      locals: {
        services: { users }
      }
    },
    params: { id } = {}
  } = req
  const {
    locals: { trx }
  } = res

  const user = await users.fetch({ id }, { trx })
  res.locals.user = user
  next()
})
