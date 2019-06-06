'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('Image', {
    tableName: 'images',
    owner() {
      return this.belongsTo('User', 'owner')
    },
    getValidators() {
      return {
        path: ['required', 'string'],
        has_descriptor: ['required', 'boolean'],
        owner: ['required', 'uuid']
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
