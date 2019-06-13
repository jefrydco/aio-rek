'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('StudentDescriptor', {
    tableName: 'student_descriptors',
    image() {
      return this.belongsTo('StudentImage', 'student_image_id')
    },
    getValidators() {
      return {
        descriptor: ['required'],
        student_image_id: ['required', 'uuid']
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
