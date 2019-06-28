'use strict'

const errorCatcher = require('async-error-catcher').default
const { RateLimiterRedis } = require('rate-limiter-flexible')
const Boom = require('@hapi/boom')
const { redis } = require('../../redis/connection')

const options = {
  redis,
  keyPrefix: 'middleware',
  points: 1000
}

const rateLimiter = new RateLimiterRedis(options)

const rateLimiterMiddleware = errorCatcher(async (req, res, next) => {
  try {
    const rateLimiterRes = await rateLimiter.consume(req.ip)
    const headers = {
      'Retry-After': rateLimiterRes.msBeforeNext / 1000,
      'X-RateLimit-Limit': options.points,
      'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext)
    }
    res.set(headers)
    await next()
  } catch (error) {
    next(Boom.tooManyRequests())
  }
})

module.exports = rateLimiterMiddleware
