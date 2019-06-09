'use strict'

const errorCatcher = require('async-error-catcher').default

module.exports = model =>
  errorCatcher(async (req, res, next) => {
    const {
      app: {
        locals: { services }
      },
      params: { id }
    } = req
    const {
      locals: { trx }
    } = res
    const service = services[`${model}s`]

    const queryResult = await service.fetch({ id }, { trx })
    res.locals[model] = queryResult
    next()
  })
