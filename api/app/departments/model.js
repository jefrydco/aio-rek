'use strict'

const Checkit = require('checkit')

module.exports = (bookshelf) =>
  bookshelf.model('Department', {
    tableName: 'departments',
    majors() {
      return this.hasMany('Major', 'department_id')
    },
    getValidators() {
      return {
        name: ['required', 'string']
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
