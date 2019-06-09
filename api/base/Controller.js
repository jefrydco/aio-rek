'use strict'

const errorCatcher = require('async-error-catcher').default
const { lowerCase } = require('lodash/fp')
const autoBind = require('auto-bind')
const pluralize = require('pluralize')

module.exports = class Controller {
  constructor(name, defaultFilter) {
    this.name = lowerCase(name.replace('Controller', ''))
    this.defaultFilter = defaultFilter
    autoBind(this)
  }
  _getPluralName() {
    return pluralize(this.name)
  }
  _getPayload({ body }) {
    return body[this.name]
  }
  _getService({
    app: {
      locals: { services }
    }
  }) {
    return services[this._getPluralName()]
  }
  _getTransaction({ locals: { trx } = {} }) {
    return trx
  }
  create(req, res, next) {
    return errorCatcher(async (req, res) => {
      const payload = this._getPayload(req)
      const service = this._getService(res)
      const transaction = this._getTransaction(res)

      const queryResult = await service.create(payload, { trx: transaction })
      return res.status(201).json({
        [this.name]: service.toJSON(queryResult, this.defaultFilter)
      })
    })(req, res, next)
  }
  fetchPage(req, res, next) {
    return errorCatcher(async (req, res) => {
      const service = this._getService(req)
      const transaction = this._getTransaction(res)
      const { models, pagination } = await service.fetchPage(req.query, {
        trx: transaction
      })
      const json = await service.toJSONArray({
        models,
        orderBy: req.query.orderBy || '-created_at',
        pagination
      })
      return res.send(json)
    })(req, res, next)
  }
  fetch(req, res, next) {
    return errorCatcher(async (req, res) => {})(req, res, next)
  }
  update(req, res, next) {
    return errorCatcher(async (req, res) => {})(req, res, next)
  }
  destroy(req, res, next) {
    return errorCatcher((req, res) => {
      console.log(req.locals[this.name])
    })(req, res, next)
  }
}
