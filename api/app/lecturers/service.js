'use strict'

const { omit } = require('lodash/fp')
const { removeEmpty } = require('../../utils/objects')
const Service = require('../base/Service')

class LecturerService extends Service {
  constructor(app) {
    super(LecturerService.name, app, ['user.hashed_password'])
  }

  async fetchPage(filter, { trx } = {}) {
    const defaultFilter = { limit: 20, offset: 0, orderBy: 'name' }
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
}

module.exports = (app) => new LecturerService(app)
