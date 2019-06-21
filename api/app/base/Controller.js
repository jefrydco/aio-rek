'use strict'

const errorCatcher = require('async-error-catcher').default
const camelCase = require('lodash/fp/camelCase')
const autoBind = require('auto-bind')
const pluralize = require('pluralize')

module.exports = class Controller {
  constructor(name) {
    // UserController -> user
    this.name = camelCase(name.replace('Controller', ''))
    autoBind(this)
  }
  _getPluralName() {
    return pluralize(this.name)
  }
  _getFormDataPayload({ file, files = [], body }) {
    return {
      file,
      files,
      body
    }
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
  _getTrx({ locals: { trx } = {} }) {
    return trx
  }
  _getParamsId({ params: { id } }) {
    return id
  }
  _getRelated({ query: { withRelated } }) {
    return withRelated
  }
  create(req, res, next) {
    return errorCatcher(async (req, res) => {
      const payload = this._getPayload(req)
      const service = this._getService(req)

      const trx = this._getTrx(res)

      const queryResult = await service.create(payload, { trx })
      return res.status(201).json({
        [this.name]: service.toJSON(queryResult)
      })
    })(req, res, next)
  }
  fetchPage(req, res, next) {
    return errorCatcher(async (req, res) => {
      const service = this._getService(req)

      const trx = this._getTrx(res)
      const { models, pagination } = await service.fetchPage(req.query, {
        trx
      })
      const json = await service.toJSONArray({
        models,
        pagination
      })
      return res.send(json)
    })(req, res, next)
  }
  fetch(req, res, next) {
    return errorCatcher(async (req, res) => {
      const service = this._getService(req)
      const id = this._getParamsId(req)
      const withRelated = this._getRelated(req)

      const trx = this._getTrx(res)
      const queryResult = await service.fetch({ id }, { trx }, withRelated)
      return res.json({
        [this.name]: service.toJSON(queryResult)
      })
    })(req, res, next)
  }
  update(req, res, next) {
    return errorCatcher(async (req, res) => {
      const payload = this._getPayload(req)
      const service = this._getService(req)
      const id = this._getParamsId(req)

      const trx = this._getTrx(res)
      const queryResult = await service.fetch({ id }, { trx })
      const updated = await service.update(queryResult, payload, { trx })
      return res.json({
        [this.name]: service.toJSON(updated)
      })
    })(req, res, next)
  }
  destroy(req, res, next) {
    return errorCatcher(async (req, res) => {
      const service = this._getService(req)
      const id = this._getParamsId(req)

      const trx = this._getTrx(res)
      const queryResult = await service.fetch({ id }, { trx })
      await service.destroy(queryResult, { trx })
      return res.sendStatus(200)
    })(req, res, next)
  }
}
