// Taken from: https://appdividend.com/2019/02/14/node-express-image-upload-and-resize-tutorial-example/#Step_7_Resize_the_image
const path = require('path')
const sharp = require('sharp')
const uuid = require('uuid/v4')

class Resize {
  constructor(folder, width = 720, height = 540) {
    this.folder = folder
    this.width = width
    this.height = height
  }
  async save(buffer) {
    const filename = Resize.filename()
    const filepath = this.filepath(filename)

    await sharp(buffer)
      .resize(this.width, this.height, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath)

    return filename
  }
  static filename() {
    return `${uuid()}.png`
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}
module.exports = Resize
