'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('LecturerImage', {
    tableName: 'lecturer_images',
    lecturer() {
      return this.belongsTo('Lecturer', 'lecturer_id')
    },
    getValidators() {
      return {
        path: ['required', 'string'],
        has_descriptor: ['boolean'],
        lecturer_id: ['required', 'uuid']
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
