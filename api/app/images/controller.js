/* eslint-disable camelcase */
'use strict'

const fs = require('fs')
const errorCatcher = require('async-error-catcher').default

exports.create = errorCatcher(async (req, res) => {
  const {
    query: { owner = {} },
    body: { has_descriptor = false },
    files
  } = req
  const {
    app: {
      locals: {
        services: { images }
      }
    },
    locals: { trx }
  } = res
  const imagesData = await Promise.all(
    files.map(({ path }) =>
      images.create({
        path: path.replace('static', ''),
        // Taken from: https://stackoverflow.com/a/16313488/7711812
        has_descriptor: !!+has_descriptor,
        owner
      })
    )
  )
  res.status(201).json({
    images: await Promise.all(
      imagesData.map(image => images.toJSON(image, { trx }))
    )
  })
})

exports.getAll = errorCatcher(async (req, res) => {
  const { query: { limit, offset, orderBy, owner } = {} } = req
  const {
    app: {
      locals: {
        services: { images }
      }
    },
    locals: { trx }
  } = res

  const imagesJSON = {
    images: await images.getImagesJSON(
      { limit, offset, orderBy, owner },
      { trx }
    )
  }
  res.json(imagesJSON)
})

exports.getOnce = errorCatcher((req, res) => {
  const {
    app: {
      locals: {
        services: { images }
      }
    },
    locals: { image, trx }
  } = res

  res.json({ image: images.toJSON(image, { trx }) })
})

exports.destroy = errorCatcher(async (req, res) => {
  const {
    app: {
      locals: {
        services: { images }
      }
    },
    locals: { image, trx }
  } = res

  let path = image.get('path')
  path = `static/${path}`
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
  await images.destroy(image, { trx })

  await res.sendStatus(200)
})
