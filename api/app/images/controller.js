'use strict'

const errorCatcher = require('async-error-catcher').default

exports.create = errorCatcher(async (req, res) => {
  const { body: { images: payload } = {}, user } = req
  const {
    app: {
      locals: {
        services: { images }
      }
    },
    locals: { trx }
  } = res
  const imagesData = await Promise.all(
    payload.map(image => images.create({ ...image, owner: user.id }, trx))
  )
  res.status(201).json({
    images: await Promise.all(
      imagesData.map(image => images.toJSON(image, user, { trx }))
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

  await images.del(image, { trx })

  res.sendStatus(200)
})
