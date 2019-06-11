'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('Lecturer', {
    tableName: 'lecturers',
    user_id() {
      this.belongsTo('User', 'user_id')
    },
    getValidators() {
      return {
        name: ['required', 'string'],
        identifier: ['required', 'string'],
        image: ['string'],
        is_active: ['boolean'],
        user_id: ['required', 'uuid']
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