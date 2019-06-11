'use strict'

const fs = require('fs')
const errorCatcher = require('async-error-catcher').default
const Controller = require('../base/Controller')

class PresenceController extends Controller {
  constructor() {
    super(PresenceController.name)
  }
  create(req, res, next) {
    return errorCatcher(async (req, res) => {
      const {
        // eslint-disable-next-line
        body: { student_id, attendance_id },
        file: { path }
      } = this._getFormDataPayload(req)
      const service = this._getService(req)

      const trx = this._getTrx(res)

      const payload = {
        image: path.replace('static', ''),
        student_id,
        attendance_id
      }

      const queryResult = await service.create(payload, {
        trx
      })

      return res.status(201).json({
        [this.name]: service.toJSON(queryResult)
      })
    })(req, res, next)
  }
  update(req, res, next) {
    return errorCatcher(async (req, res) => {
      const {
        // eslint-disable-next-line
        body: { student_id, attendance_id },
        file: { path }
      } = this._getFormDataPayload(req)
      const service = this._getService(req)
      const id = this._getParamsId(req)

      const trx = this._getTrx(res)

      const queryResult = await service.fetch({ id }, trx)

      let oldPath = queryResult.get('image')
      if (oldPath) {
        oldPath = `static/${oldPath}`
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      const payload = {
        image: path.replace('static', ''),
        student_id,
        attendance_id
      }

      const updated = await service.update(queryResult, payload, {
        trx
      })
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

      let path = queryResult.get('image')
      if (path) {
        path = `static/${path}`
        if (fs.existsSync(path)) {
          fs.unlinkSync(path)
        }
      }

      await service.destroy(queryResult, { trx })
      return res.sendStatus(200)
    })(req, res, next)
  }
}

module.exports = new PresenceController()
