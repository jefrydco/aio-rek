'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('Room', {
    tableName: 'rooms',
    getValidators() {
      return {
        name: ['required', 'string'],
        in_use: ['boolean']
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
