'use strict'

const pluralize = require('pluralize')
const omit = require('lodash/fp/omit')
const camelCase = require('lodash/fp/camelCase')
const { removeEmpty } = require('../../utils/objects')

module.exports = class Service {
  constructor(name, app, defaultFilter = []) {
    // UserService -> User
    this.name = name.replace('Service', '')
    this.app = app
    this.defaultFilter = [...defaultFilter, 'created_at', 'updated_at']
  }
  _getPluralName() {
    return pluralize(this.name)
  }
  _getModel(attributes) {
    const {
      locals: { models }
    } = this.app
    const Model = models[this.name]
    if (attributes) {
      return new Model(attributes)
    }
    return new Model(attributes)
  }
  async create(attributes, { trx } = {}) {
    const model = this._getModel(attributes)

    const queryResult = await model.save(null, {
      method: 'insert',
      require: true,
      transacting: trx
    })
    return queryResult
  }
  async fetchPage(filter, { trx } = {}) {
    const defaultFilter = { limit: 20, offset: 0, orderBy: '-created_at' }
    const _filter = {
      ...defaultFilter,
      ...filter,
      limit: parseInt(filter.limit)
    }

    const model = this._getModel()

    let { withRelated } = _filter
    if (withRelated) {
      withRelated = withRelated.split(',')
    } else {
      withRelated = []
    }

    const whereClause = omit(
      ['limit', 'offset', 'orderBy', 'withRelated'],
      removeEmpty(_filter)
    )

    if (_filter.limit === -1) {
      const queryResult = await model
        .orderBy(_filter.orderBy)
        .where(whereClause)
        .fetchAll({
          withRelated,
          transacting: trx
        })
      return queryResult
    }

    const queryResult = await model
      .orderBy(_filter.orderBy)
      .where(whereClause)
      .fetchPage({
        limit: _filter.limit,
        offset: _filter.offset,
        withRelated,
        transacting: trx
      })
    return queryResult
  }
  async fetch(attributes, { trx } = {}, withRelated) {
    const model = this._getModel(attributes)

    if (withRelated) {
      withRelated = withRelated.split(',')
    } else {
      withRelated = []
    }

    const queryResult = await model.fetch({
      require: true,
      withRelated,
      transacting: trx
    })
    return queryResult
  }
  async destroy(model, { trx } = {}) {
    const deleted = await model.destroy({
      require: true,
      transacting: trx
    })
    return deleted
  }
  async update(model, attributes, { trx } = {}) {
    const updated = await model.save(attributes, {
      method: 'update',
      patch: true,
      require: true,
      transacting: trx
    })
    return updated
  }
  async toJSONArray({ models = [], orderBy, pagination }) {
    const jsonArray = await Promise.all(models.map(model => this.toJSON(model)))
    return {
      ...pagination,
      orderBy,
      [camelCase(this._getPluralName())]: jsonArray
    }
  }
  toJSON(model, additionalFilter = []) {
    let json = model.toJSON()
    const deletedKey = [...additionalFilter, ...this.defaultFilter]
    json = omit(deletedKey, json)
    return json
  }
}
