'use strict'

const errorCatcher = require('async-error-catcher').default
const pluralize = require('pluralize')

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
    const service = services[pluralize(model)]

    const queryResult = await service.fetch({ id }, { trx })
    res.locals[model] = queryResult
    next()
  })
