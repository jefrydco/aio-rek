'use strict'

const rimraf = require('rimraf')
const errorCatcher = require('async-error-catcher').default

exports.handleId = errorCatcher(async (req, res, next) => {
  const {
    app: {
      locals: {
        services: { images }
      }
    },
    params: { id } = {}
  } = req
  const {
    locals: { trx }
  } = res

  const image = await images.fetch({ id }, { trx })
  res.locals.image = image
  next()
})

exports.handleDescriptor = errorCatcher((req, res, next) => {
  const { body: { descriptors: payload, owner } = {}, files } = req

  if (files.length === 0) {
    throw new Error('Images are required')
  }
  if (!payload) {
    throw new Error('Descriptors are required')
  }

  let descriptors = null
  try {
    descriptors = JSON.parse(payload)
  } catch (error) {
    throw error
  }
  if (!Array.isArray(descriptors)) {
    throw new Error('Descriptors should be a stringify of an Array')
  }
  if (files.length !== descriptors.length) {
    const [{ destination }] = files
    rimraf(destination, error => {
      if (error) {
        throw error
      }
    })
    throw new Error(`Files and descriptors count should be same`)
  }
  descriptors = descriptors.map((descriptor, i) => {
    const { path } = files[i]
    return {
      path,
      descriptor,
      owner
    }
  })
  res.locals.descriptors = descriptors
  next()
})
