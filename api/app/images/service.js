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
  async delay(image, { trx } = {}) {
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
  async toJSON(image, user, { trx } = {}) {
    await image.load(['owner'], { transacting: trx })
    return {
      path: image.get('path'),
      descriptor: image.get('descriptor'),
      owner: await app.locals.services.users.getProfileJSON(
        image.related('owner'),
        { trx }
      )
    }
  }
})
