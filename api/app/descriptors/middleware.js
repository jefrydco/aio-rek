'use strict'

const errorCatcher = require('async-error-catcher').default

exports.handleId = errorCatcher(async (req, res, next) => {
  const {
    app: {
      locals: {
        services: { descriptors }
      }
    },
    params: { id } = {}
  } = req
  const {
    locals: { trx }
  } = res

  const descriptor = await descriptors.fetch({ id }, { trx })
  res.locals.descriptor = descriptor
  next()
})
