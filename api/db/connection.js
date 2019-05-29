'use strict'

const knex = require('knex')
const config = require('../config')

exports.knex = global.__KNEX_TEST__ || knex(config.get('db'))
