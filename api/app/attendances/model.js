'use strict'

const Checkit = require('checkit')

module.exports = bookshelf =>
  bookshelf.model('Attendance', {
    tableName: 'attendances',
    schedule() {
      return this.belongsTo('Schedule', 'schedule_id')
    },
    room() {
      return this.belongsTo('Room', 'room_id')
    },
    getValidators() {
      return {
        is_active: ['boolean'],
        start_datetime: ['required'],
        end_datetime: ['required'],
        schedule_id: ['required', 'uuid'],
        room_id: ['required', 'uuid']
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
