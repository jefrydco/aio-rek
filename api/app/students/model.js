'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('Student', {
    tableName: 'students',
    images() {
      return this.hasMany('StudentImage', 'student_id')
    },
    user() {
      return this.belongsTo('User', 'user_id')
    },
    study_program() {
      return this.belongsTo('StudyProgram', 'study_program_id')
    },
    group() {
      return this.belongsTo('Group', 'group_id')
    },
    getValidators() {
      return {
        name: ['required', 'string'],
        identifier: ['required', 'string'],
        image: ['string'],
        is_active: ['boolean'],
        user_id: ['required', 'uuid'],
        study_program_id: ['required', 'uuid'],
        group_id: ['required', 'uuid']
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
