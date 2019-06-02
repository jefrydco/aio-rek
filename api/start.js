const express = require('express')
const consola = require('consola')

const config = require('../nuxt.config.js')
const app = express()
const api = require('./').handler
config.dev = !(process.env.NODE_ENV === 'production')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT_API || 3001

// Listen the server
app.use('/api', api)
app.listen(port, host)
consola.ready({
  message: `API listening on http://${host}:${port}`,
  badge: true
})
