'use strict'

const bcrypt = require('bcrypt')
const Checkit = require('checkit')
const { isString } = require('lodash/fp')

module.exports = bookshelf =>
  bookshelf.model('User', {
    tableName: 'users',
    getValidators() {
      return {
        email: ['required', 'email', this.unsafeValidateUnique(['email'])],
        image: ['string'],
        username: [
          'required',
          'string',
          'alphaNumeric',
          this.unsafeValidateUnique(['username'])
        ]
      }
    },
    getMaybeValidators() {
      return {
        password: ['required', 'string']
      }
    },
    virtuals: {
      password: {
        get() {},
        set(password) {
          this._password = password
        }
      }
    },
    initialize() {
      this.on('saving', this.handleSaving)
    },
    async handleSaving(model, attrs, options) {
      const validatePassword = this.isNew() || isString(this._password)

      const checkit = new Checkit(this.getValidators(), {
        messages: {
          required: `can't be blank`
        }
      })

      checkit.maybe(this.getMaybeValidators(), () => validatePassword)

      await checkit.run(
        {
          ...this.attributes,
          password: this._password
        },
        options
      )

      if (validatePassword) {
        const hashedPassword = await bcrypt.hash(this._password, 12)
        this.set('hashed_password', hashedPassword)
        delete this._password
      }
    },
    async isValidPassword(password) {
      const result = await bcrypt.compare(password, this.get('hashed_password'))
      return result
    }
  })
