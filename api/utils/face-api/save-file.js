import * as fs from 'fs'
import * as path from 'path'

const baseDir = path.resolve('static/detections')

export function saveFile(fileName, buf) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }

  fs.writeFileSync(path.resolve(baseDir, fileName), buf)
}
