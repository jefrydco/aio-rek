'use strict'

const fs = require('fs')
const path = require('path')
const multer = require('multer')
const uuid = require('uuid/v4')

const multerFactory = (location, fileTypes = /jpeg|jpg/) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const {
        user: { role },
        // eslint-disable-next-line
        query: { student_id, lecturer_id }
      } = req
      if (role && (role === 'admin' || role === 'device')) {
        const uploadPath = path.join(
          location,
          // eslint-disable-next-line
          student_id || lecturer_id || 'others'
        )

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath)
      } else {
        cb(new Error('Unautorized'))
      }
    },
    filename(req, file, cb) {
      cb(null, `${uuid()}.jpg`)
    }
  })
  const fileFilter = (req, file, cb) => {
    const mimetype = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    )

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(
      new Error(
        `Error: File upload only supports the following filetypes - ${fileTypes}`
      )
    )
  }
  const upload = multer({
    storage,
    fileFilter
  })
  return upload
}

module.exports = multerFactory
