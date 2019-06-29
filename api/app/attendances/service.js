'use strict'

const moment = require('moment')
const omit = require('lodash/fp/omit')
const Service = require('../base/Service')

class AttendanceService extends Service {
  constructor(app) {
    super(AttendanceService.name, app)
  }
  toJSON(model, additionalFilter = []) {
    let json = model.toJSON()
    const startDatetime = moment(json.start_datetime)
    const endDatetime = moment(json.end_datetime)
    const deletedKey = [...additionalFilter, ...this.defaultFilter]
    json = omit(deletedKey, json)
    return {
      ...json,
      diff_datetime: endDatetime.diff(startDatetime)
    }
  }
}

module.exports = app => new AttendanceService(app)
