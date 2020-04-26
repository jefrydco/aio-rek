'use strict'

const Checkit = require('checkit')

module.exports = (bookshelf) =>
  bookshelf.model('Major', {
    tableName: 'majors',
    studyProgram() {
      return this.belongsTo('StudyProgram', 'study_program_id')
    },
    department() {
      return this.belongsTo('Department', 'department_id')
    },
    getValidators() {
      return {
        name: ['required', 'string'],
        study_program_id: ['required', 'uuid'],
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
