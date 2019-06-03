'use strict'

const fs = require('fs')
const path = require('path')
const convict = require('convict')
require('dotenv').config()

const privateKey = fs.readFileSync(
  path.resolve('api/keys', 'private.key'),
  'utf-8'
)
const publicKey = fs.readFileSync(
  path.resolve('api/keys', 'public.key'),
  'utf-8'
)

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['development', 'test', 'production'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'THe IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  pino: {
    level: {
      doc: 'Pino log level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
      env: 'PINO_LEVEL'
    }
  },
  db: {
    debug: {
      doc: 'Debug database queries',
      format: Boolean,
      default: false,
      env: 'DB_DEBUG'
    },
    client: 'pg',
    connection: {
      host: {
        doc: 'Database host name/IP',
        format: '*',
        default: '127.0.0.1',
        env: 'DB_HOST'
      },
      port: {
        doc: 'Database port',
        format: 'port',
        default: 5432,
        env: 'DB_PORT'
      },
      database: {
        doc: 'Database name',
        format: String,
        default: null,
        env: 'DB_NAME'
      },
      user: {
        doc: 'Database user',
        format: String,
        default: null,
        env: 'DB_USER'
      },
      password: {
        doc: 'Database password',
        format: String,
        default: null,
        sensitive: true,
        env: 'DB_PASSWORD'
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve('api/db/migrations')
    },
    seeds: {
      directory: path.resolve('api/db/seeds')
    }
  },
  redis: {
    host: {
      doc: 'Redis host',
      format: '*',
      default: '127.0.0.1',
      env: 'REDIS_HOST'
    },
    port: {
      doc: 'Redis port',
      format: 'port',
      default: 6379,
      env: 'REDIS_PORT'
    },
    password: {
      doc: 'Redis password',
      format: String,
      default: null,
      sensitive: true,
      env: 'REDIS_PASSWORD'
    },
    enable_offline_queue: {
      doc: 'Redis offline queue',
      format: Boolean,
      default: false,
      env: 'REDIS_OFFLINE_QUEUE'
    }
  },
  privateKey: {
    doc: 'JWT private',
    format: String,
    default: privateKey,
    sensitive: true,
    env: 'PRIVATE_KEY'
  },
  publicKey: {
    doc: 'JWT public',
    format: String,
    default: publicKey,
    sensitive: true,
    env: 'PUBLIC_KEY'
  },
  ci: {
    doc: `Flat indicating whether we're running on a CI server`,
    format: Boolean,
    default: false,
    env: 'CI'
  }
})

const configFilePath = path.join(__dirname, `${config.get('env')}.json`)
if (fs.existsSync(configFilePath)) {
  config.loadFile(configFilePath)
}
config.validate({ allowed: 'strict' })

module.exports = config
