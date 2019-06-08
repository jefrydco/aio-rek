'use strict'

module.exports = app => ({
  async create(attributes, { trx } = {}) {
    const {
      locals: {
        models: { Image }
      }
    } = app
    const image = new Image(attributes)
    const queryResult = await image.save(null, {
      method: 'insert',
      require: true,
      transacting: trx
    })
    return queryResult
  },
  async fetch(attributes, { trx } = {}) {
    const {
      locals: {
        models: { Image }
      }
    } = app
    const image = new Image(attributes)

    const queryResult = await image.fetch({
      require: true,
      transacting: trx
    })
    return queryResult
  },
  async destroy(image, { trx } = {}) {
    const deletedImage = await image.destroy({
      require: true,
      transacting: trx
    })
    return deletedImage
  },
  async update(image, attributes, { trx } = {}) {
    const updatedImage = await image.save(attributes, {
      method: 'update',
      patch: true,
      require: true,
      transacting: trx
    })
    return updatedImage
  },
  toJSON(image, { trx } = {}) {
    return {
      id: image.id,
      path: image.get('path'),
      hasDescriptor: image.get('has_descriptor')
    }
  },
  async getImagesJSON(
    {
      limit = 9,
      offset = 0,
      orderBy = '-created_at',
      owner,
      withDescriptor = 0
    } = {},
    { trx } = {}
  ) {
    const {
      locals: {
        models: { Image }
      }
    } = app
    const image = new Image()

    let queryResult = null
    if (owner) {
      queryResult = await image
        .query('where', 'owner', owner)
        .orderBy(orderBy)
        .fetchPage({
          limit,
          offset,
          transacting: trx
        })
    } else {
      queryResult = await image.orderBy(orderBy).fetchPage({
        limit,
        offset,
        transacting: trx
      })
    }
    const { models: images, pagination } = queryResult

    const imagesJSON = {
      ...pagination,
      orderBy,
      images: await Promise.all(
        images.map(async image => {
          const imageJSON = await app.locals.services.images.toJSON(image, {
            trx
          })
          if (+withDescriptor) {
            const {
              descriptors: [descriptor]
            } = await app.locals.services.descriptors.getDescriptorsJSON(
              {
                limit: 1,
                image: image.id
              },
              { trx }
            )
            return {
              ...imageJSON,
              ...descriptor
            }
          }
          return imageJSON
        })
      )
    }

    return imagesJSON
  }
})
