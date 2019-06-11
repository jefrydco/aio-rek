'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('Schedule', {
    tableName: 'schedules',
    subject_id() {
      return this.belongsTo('Subject', 'subject_id')
    },
    lecturer_id() {
      return this.belongsTo('Lecturer', 'lecturer_id')
    },
    room_id() {
      return this.belongsTo('Room', 'room_id')
    },
    study_program_id() {
      return this.belongsTo('StudyProgram', 'study_program_id')
    },
    group_id() {
      return this.belongsTo('Group', 'group_id')
    },
    getValidators() {
      return {
        day: ['required', 'string'],
        start_time: ['required'],
        end_time: ['required'],
        subject_id: ['required', 'uuid'],
        lecturer_id: ['required', 'uuid'],
        room_id: ['required', 'uuid'],
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
