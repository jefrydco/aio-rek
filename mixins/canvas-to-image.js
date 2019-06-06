import { ulid } from 'ulid'

export default {
  methods: {
    getImageFromCanvas(
      canvas,
      filename = ulid(),
      mime = 'image/jpeg',
      quality = 1
    ) {
      const [, extension] = mime.split('/')
      filename = `${filename}.${extension}`
      return new Promise(resolve => {
        canvas.toBlob(resolve, mime, quality)
      }).then(blob => {
        return new File([blob], filename, {
          type: blob.type
        })
      })
    }
  }
}
