'use strict'

module.exports = app => ({
  async create(attributes, { trx } = {}) {
    const image = await app.locals.models.Image.forge(attributes).save(null, {
      method: 'insert',
      require: true,
      transacting: trx
    })
    return image
  },
  async fetch(attributes, { trx } = {}) {
    const image = await app.locals.models.Image.forge(attributes).fetch({
      require: true,
      transacting: trx
    })
    return image
  },
  async del(image, { trx } = {}) {
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
      descriptor: image.get('descriptor')
    }
  },
  async getImagesJSON(
    { limit = 20, offset = 0, orderBy = '-created_at', owner } = {},
    { trx } = {}
  ) {
    let queryResult = null
    if (owner) {
      queryResult = await app.locals.models.Image.forge()
        .query('where', 'owner', owner)
        .orderBy(orderBy)
        .fetchPage({
          limit,
          offset,
          transacting: trx
        })
    } else {
      queryResult = await app.locals.models.Image.forge()
        .orderBy(orderBy)
        .fetchPage({
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
          return imageJSON
        })
      )
    }

    return imagesJSON
  }
})
