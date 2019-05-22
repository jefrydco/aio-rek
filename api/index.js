import express from 'express'
import recognize from './routes/recognize'

const app = express()

app.use('/user', recognize)

export default {
  path: '/api',
  handler: app
}
