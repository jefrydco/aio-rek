'use strict'

const { RateLimiterRedis } = require('rate-limiter-flexible')
const Boom = require('@hapi/boom')
const { redis } = require('../../redis/connection')

const rateLimiter = new RateLimiterRedis({
  redis,
  keyPrefix: 'middleware'
})

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip)
    await next()
  } catch (error) {
    next(Boom.tooManyRequests())
  }
}

module.exports = rateLimiterMiddleware
