'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('Descriptor', {
    tableName: 'descriptors',
    image() {
      return this.belongsTo('Image', 'image')
    },
    getValidators() {
      return {
        descriptor: ['required'],
        image: ['required', 'uuid']
      }
    },
    initialize() {
      this.on('saving', this.handleSaving)
    },
    async handleSaving(model, attrs, options) {
      const checkit = new Checkit(this.getValidators(), {
        messages: {
          required: `can't be blank`
        }
      })
      await checkit.run(this.attributes, options)
    }
  })
