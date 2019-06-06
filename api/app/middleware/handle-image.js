'use strict'

const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { ulid } = require('ulid')

const multerFactory = (location, fileTypes = /jpeg|jpg/) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const {
        user,
        query: { owner = '' }
      } = req
      let uploadPath = path.join(location)
      if (user.role === 'student') {
        uploadPath = path.join(uploadPath, user.id)
      } else if (user.role === 'admin') {
        uploadPath = path.join(uploadPath, owner)
      }
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
      }
      cb(null, uploadPath)
    },
    filename(req, file, cb) {
      cb(null, `${ulid()}.jpg`)
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
