/* eslint-disable camelcase */
'use strict'

const fs = require('fs')
const boolean = require('boolean')
const pluralize = require('pluralize')
const errorCatcher = require('async-error-catcher').default
const Controller = require('../base/Controller')

class ImageController extends Controller {
  constructor() {
    super(ImageController.name)
  }
  create(req, res, next) {
    return errorCatcher(async (req, res) => {
      const {
        files,
        // eslint-disable-next-line
        body: { has_descriptor = false }
      } = this._getFormDataPayload(req)
      const {
        query: { student_id }
      } = req
      const service = this._getService(req)

      const trx = this._getTrx(res)

      if (files.length === 0) {
        throw new Error(`Images field should contain at least one image`)
      }

      const queryResults = await Promise.all(
        files.map(({ path }) =>
          service.create(
            {
              path: path.replace('static', ''),
              has_descriptor: boolean(has_descriptor),
              student_id
            },
            { trx }
          )
        )
      )
      return res.status(201).json({
        [pluralize(this.name)]: await Promise.all(
          queryResults.map(queryResult => service.toJSON(queryResult))
        )
      })
    })(req, res, next)
  }
  update(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { body, file } = this._getFormDataPayload(req)
      const {
        query: { student_id }
      } = req
      const service = this._getService(req)
      const id = this._getParamsId(req)

      const trx = this._getTrx(res)

      const queryResult = await service.fetch({ id }, { trx })

      let payload = null
      if (file) {
        const { has_descriptor } = body
        const { path } = file

        let oldPath = queryResult.get('path')
        if (oldPath) {
          oldPath = `static/${oldPath}`
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath)
          }
        }

        payload = {
          path: path.replace('static', ''),
          student_id,
          has_descriptor: boolean(has_descriptor)
        }
      } else {
        payload = this._getPayload(req)
      }

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

      let oldPath = queryResult.get('path')
      if (oldPath) {
        oldPath = `static/${oldPath}`
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      await service.destroy(queryResult, { trx })
      return res.sendStatus(200)
    })(req, res, next)
  }
}

module.exports = new ImageController()

// exports.create = errorCatcher(async (req, res) => {
//   const {
//     query: { owner = {} },
//     body: { has_descriptor = false },
//     files
//   } = req
//   const {
//     app: {
//       locals: {
//         services: { images }
//       }
//     },
//     locals: { trx }
//   } = res
//   const imagesData = await Promise.all(
//     files.map(({ path }) =>
//       images.create({
//         path: path.replace('static', ''),
//         // Taken from: https://stackoverflow.com/a/16313488/7711812
//         has_descriptor: !!+has_descriptor,
//         owner
//       })
//     )
//   )
//   res.status(201).json({
//     images: await Promise.all(
//       imagesData.map(image => images.toJSON(image, { trx }))
//     )
//   })
// })

// exports.getAll = errorCatcher(async (req, res) => {
//   const { query: { limit, offset, orderBy, owner, withDescriptor } = {} } = req
//   const {
//     app: {
//       locals: {
//         services: { images }
//       }
//     },
//     locals: { trx }
//   } = res

//   const imagesJSON = {
//     images: await images.getImagesJSON(
//       { limit, offset, orderBy, owner, withDescriptor },
//       { trx }
//     )
//   }
//   res.json(imagesJSON)
// })

// exports.getOnce = errorCatcher((req, res) => {
//   const {
//     app: {
//       locals: {
//         services: { images }
//       }
//     },
//     locals: { image, trx }
//   } = res

//   res.json({ image: images.toJSON(image, { trx }) })
// })

// exports.update = errorCatcher(async (req, res) => {
//   const { body: { image: { has_descriptor = false } } = {} } = req
//   const {
//     app: {
//       locals: {
//         services: { images }
//       }
//     },
//     locals: { image, trx }
//   } = res

//   const updatedImage = await images.update(image, { has_descriptor })
//   res.json({
//     image: images.toJSON(updatedImage, { trx })
//   })
// })

// exports.destroy = errorCatcher(async (req, res) => {
//   const {
//     app: {
//       locals: {
//         services: { images }
//       }
//     },
//     locals: { image, trx }
//   } = res

//   let path = image.get('path')
//   path = `static/${path}`
//   if (fs.existsSync(path)) {
//     fs.unlinkSync(path)
//   }
//   await images.destroy(image, { trx })

//   await res.sendStatus(200)
// })
