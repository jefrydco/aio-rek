'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('StudyProgram', {
    tableName: 'study_programs',
    department_id() {
      return this.belongsTo('Department', 'department_id')
    },
    getValidators() {
      return {
        name: ['required', 'string'],
        department_id: ['required', 'uuid']
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
