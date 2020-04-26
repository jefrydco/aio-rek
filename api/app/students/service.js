'use strict'

const omit = require('lodash/fp/omit')
const { removeEmpty } = require('../../utils/objects')
const Service = require('../base/Service')

class StudentService extends Service {
  constructor(app) {
    super(StudentService.name, app, ['user.hashed_password'])
  }

  async fetchPage(filter, { trx } = {}) {
    const defaultFilter = { limit: 20, offset: 0, orderBy: 'identifier' }
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

    if (_filter.orderBy.length === 0) {
      _filter.orderBy = 'identifier'
    }

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
}

module.exports = (app) => new StudentService(app)
