'use strict'

module.exports = app => ({
  async create(attributes, { trx } = {}) {
    const descriptor = await app.locals.models.Descriptor.forge(
      attributes
    ).save(null, {
      method: 'insert',
      require: true,
      transacting: trx
    })
    return descriptor
  },
  async fetch(attributes, { trx } = {}) {
    const descriptor = await app.locals.models.Descriptor.forge(
      attributes
    ).fetch({
      require: true,
      transacting: trx
    })
    return descriptor
  },
  async destroy(descriptor, { trx } = {}) {
    const deletedDescriptor = await descriptor.destroy({
      require: true,
      transacting: trx
    })
    return deletedDescriptor
  },
  async update(descriptor, attributes, { trx } = {}) {
    const updatedDescriptor = await descriptor.save(attributes, {
      method: 'update',
      patch: true,
      require: true,
      transacting: trx
    })
    return updatedDescriptor
  },
  toJSON(descriptor, { trx } = {}) {
    return {
      id: descriptor.id,
      descriptor: descriptor.get('descriptor')
    }
  },
  async getDescriptorsJSON(
    { limit = 9, offset = 0, orderBy = '-created_at', image } = {},
    { trx } = {}
  ) {
    let queryResult = null
    if (image) {
      queryResult = await app.locals.models.Descriptor.forge()
        .query('where', 'image', image)
        .orderBy(orderBy)
        .fetchPage({ limit, offset, transacting: trx })
    } else {
      queryResult = await app.locals.models.Descriptor.forge()
        .orderBy(orderBy)
        .fetchPage({ limit, offset, transacting: trx })
    }
    const { models: descriptors, pagination } = queryResult

    const descriptorsJSON = {
      ...pagination,
      orderBy,
      descriptors: await Promise.all(
        descriptors.map(async descriptor => {
          const descriptorJSON = await app.locals.services.descriptors.toJSON(
            descriptor,
            { trx }
          )
          return descriptorJSON
        })
      )
    }

    return descriptorsJSON
  }
})
