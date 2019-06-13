'use strict'

const Controller = require('../base/Controller')

class StudentDescriptorController extends Controller {
  constructor() {
    super(StudentDescriptorController.name)
  }
}

module.exports = new StudentDescriptorController()

// const errorCatcher = require('async-error-catcher').default

// exports.create = errorCatcher(async (req, res) => {
//   const {
//     body: { descriptors: descriptorsReq }
//   } = req
//   const {
//     app: {
//       locals: {
//         services: { descriptors }
//       }
//     },
//     locals: { trx }
//   } = res
//   const descriptorsData = await Promise.all(
//     descriptorsReq.map(({ descriptor, image }) => {
//       return descriptors.create({ descriptor, image }, { trx })
//     })
//   )
//   res.status(201).json({
//     descriptors: await Promise.all(
//       descriptorsData.map(descriptor => descriptors.toJSON(descriptor, { trx }))
//     )
//   })
// })

// exports.destroy = errorCatcher(async (req, res) => {
//   const {
//     app: {
//       locals: {
//         services: { descriptors }
//       }
//     },
//     locals: { descriptor, trx }
//   } = res

//   await descriptors.destroy(descriptor, { trx })
//   await res.sendStatus(200)
// })
