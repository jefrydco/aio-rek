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
  toJSON(image, user, { trx } = {}) {
    return {
      id: image.id,
      path: image.get('path'),
      descriptor: image.get('descriptor')
    }
  },
  async getImagesJSON({ limit = 20, offset = 0 } = {}, user, { trx } = {}) {
    const { models: images, pagination } = await app.locals.models.Image.forge()
      .query('where', 'owner', user.id)
      .orderBy('created_at', 'DESC')
      .fetchPage({
        limit,
        offset,
        transacting: trx
      })

    const imagesJSON = {
      count: pagination.rowCount,
      images: await Promise.all(
        images.map(async image => {
          const imageJSON = await app.locals.services.images.toJSON(
            image,
            user,
            { trx }
          )
          return imageJSON
        })
      )
    }

    return imagesJSON
  }
})
