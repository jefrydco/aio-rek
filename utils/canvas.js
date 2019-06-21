const uuid = require('uuid/v4')

export const getImageFromCanvas = (
  canvas,
  filename = uuid(),
  mime = 'image/jpeg',
  quality = 1
) => {
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

// Taken from: https://stackoverflow.com/questions/3129099/how-to-flip-images-horizontally-with-html5
export const drawImage = (
  context,
  img,
  x,
  y,
  width = img.width,
  height = img.height,
  { deg = 0, isFlip = false, isFlop = false, isCenter = false } = {
    deg: 0,
    isFlip: false,
    isFlop: false,
    isCenter: false
  }
) => {
  context.save()

  // Set rotation point to center of image, instead of top/left
  if (isCenter) {
    x -= width / 2
    y -= height / 2
  }

  // Set the origin to the center of the image
  context.translate(x + width / 2, y + height / 2)

  // Rotate the canvas around the origin
  const rad = 2 * Math.PI - (deg * Math.PI) / 180
  context.rotate(rad)

  // Flip/Flop the canvas
  let flipScale, flopScale
  if (isFlip) {
    flipScale = -1
  } else {
    flipScale = 1
  }
  if (isFlop) {
    flopScale = -1
  } else {
    flopScale = 1
  }
  context.scale(flipScale, flopScale)

  // Draw the image
  context.drawImage(img, -width / 2, -height / 2, width, height)

  context.restore()
}
