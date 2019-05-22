import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { ulid } from 'ulid'

const baseDirRecognize = path.resolve('static/uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(baseDirRecognize)) {
      fs.mkdirSync(baseDirRecognize)
    }

    cb(null, baseDirRecognize)
  },
  filename: (req, file, cb) => {
    cb(null, `${ulid()}.jpg`)
  }
})

const recognize = multer({ storage }).array('images')
export default recognize
