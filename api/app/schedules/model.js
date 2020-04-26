'use strict'

const Checkit = require('checkit')

module.exports = (bookshelf) =>
  bookshelf.model('Schedule', {
    tableName: 'schedules',
    subject() {
      return this.belongsTo('Subject', 'subject_id')
    },
    lecturer() {
      return this.belongsTo('Lecturer', 'lecturer_id')
    },
    room() {
      return this.belongsTo('Room', 'room_id')
    },
    study_program() {
      return this.belongsTo('StudyProgram', 'study_program_id')
    },
    major() {
      return this.belongsTo('Major', 'major_id')
    },
    group() {
      return this.belongsTo('Group', 'group_id')
    },
    getValidators() {
      return {
        day: ['required', 'string'],
        start_time: ['required'],
        end_time: ['required'],
        grade: ['required', 'string'],
        subject_id: ['required', 'uuid'],
        lecturer_id: ['required', 'uuid'],
        room_id: ['required', 'uuid'],
        study_program_id: ['required', 'uuid'],
        major_id: ['required', 'uuid'],
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
