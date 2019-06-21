'use strict'

const argon2 = require('argon2')
const Checkit = require('checkit')
const isString = require('lodash/fp/isString')

module.exports = bookshelf =>
  bookshelf.model('User', {
    tableName: 'users',
    getValidators() {
      return {
        email: ['required', 'email', this.unsafeValidateUnique(['email'])],
        role: ['string']
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
        const hashedPassword = await argon2.hash(this._password, {
          type: argon2.argon2id
        })
        this.set('hashed_password', hashedPassword)
        delete this._password
      }
    },
    async isValidPassword(password) {
      const result = await argon2.verify(this.get('hashed_password'), password)
      return result
    }
  })
