'use strict'

const redis = require('redis')
const config = require('../config')

exports.redis = redis.createClient(config.get('redis'))
