// Taken from: https://github.com/mihalydanis/node-express-knex-skeleton/blob/master/config/db.js

import Joi from '@hapi/joi'
require('dotenv').config()

const schema = Joi.object({
  host: Joi.default(process.env.DB_HOST),
  client: Joi.default(process.env.DB_CLIENT),
  database: Joi.default(process.env.DB_NAME),
  user: Joi.default(process.env.DB_USER),
  password: Joi.default(process.env.DB_PASSWORD),
  migration: Joi.default(process.env.DB_TABLE)
})
  .unknown()
  .required()

const { error, value } = Joi.validate(process.env, schema)

if (error) {
  throw new Error('Config validation error:', error.message)
}

export default {
  host: value.host,
  client: value.client,
  database: value.database,
  user: value.user,
  password: value.password,
  migration: value.migration
}
