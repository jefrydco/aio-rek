'use strict'

const errorCatcher = require('async-error-catcher').default

exports.handleId = errorCatcher(async (req, res, next) => {
  const {
    app: {
      locals: {
        services: { images }
      }
    },
    params: { id } = {}
  } = req
  const {
    locals: { trx }
  } = res

  const image = await images.fetch({ id }, { trx })
  res.locals.image = image
  next()
})
