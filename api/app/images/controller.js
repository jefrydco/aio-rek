'use strict'

const fs = require('fs')
const errorCatcher = require('async-error-catcher').default

exports.create = errorCatcher(async (req, res) => {
  const {
    app: {
      locals: {
        services: { images }
      }
    },
    locals: { descriptors, trx }
  } = res
  const imagesData = await Promise.all(
    descriptors.map(({ path, descriptor, owner }) =>
      images.create({ path, descriptor, owner }, trx)
    )
  )
  res.status(201).json({
    images: await Promise.all(
      imagesData.map(image => images.toJSON(image, { trx }))
    )
  })
})

exports.del = errorCatcher(async (req, res) => {
  const {
    app: {
      locals: {
        services: { images }
      }
    },
    locals: { image, trx } = {}
  } = res

  const path = image.get('path')
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
  await images.del(image, { trx })

  res.sendStatus(200)
})
