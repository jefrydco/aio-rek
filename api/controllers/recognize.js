import path from 'path'
import { ulid } from 'ulid'
import * as faceapi from 'face-api.js'

import {
  canvas,
  faceDetectionNet,
  faceDetectionOptions,
  saveFile
} from '../utils/face-api'

const classes = [
  'amy',
  'bernadette',
  'howard',
  'leonard',
  'penny',
  'raj',
  'sheldon',
  'stuart'
]

function getFaceImageUri(className, idx) {
  return `${className}/${className}${idx}.png`
}

async function createBbtFaceMatcher(numImagesForTraining = 1) {
  const maxAvailableImagesPerClass = 5
  numImagesForTraining = Math.min(
    numImagesForTraining,
    maxAvailableImagesPerClass
  )

  const labeledFaceDescriptors = await Promise.all(
    classes.map(async className => {
      const descriptors = []
      for (let i = 1; i < numImagesForTraining + 1; i++) {
        const img = await canvas.loadImage(
          path.resolve('data/images', getFaceImageUri(className, i))
        )
        descriptors.push(await faceapi.computeFaceDescriptor(img))
      }

      return new faceapi.LabeledFaceDescriptors(className, descriptors)
    })
  )

  return new faceapi.FaceMatcher(labeledFaceDescriptors)
}

export const get = (req, res) => {
  res.sendStatus(200)
}

export const post = async (req, res) => {
  const model = path.resolve('data/models')
  await faceDetectionNet.loadFromDisk(model)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(model)
  await faceapi.nets.faceRecognitionNet.loadFromDisk(model)

  const img = await canvas.loadImage(req.files[0].path)
  const results = await faceapi
    .detectAllFaces(img, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors()
  const faceMatcher = await createBbtFaceMatcher(5)
  const out = await faceapi.createCanvasFromMedia(img)
  await results.forEach(({ detection, descriptor }) => {
    const label = faceMatcher.findBestMatch(descriptor).toString()
    const options = { label }
    const drawBox = new faceapi.draw.DrawBox(detection.box, options)
    drawBox.draw(out)
  })
  await saveFile(`${ulid()}.jpg`, out.toBuffer('image/jpeg'))

  // const referenceImage = await canvas.loadImage(
  //   path.resolve('data/images', 'bbt1.jpg')
  // )
  // const queryImage = await canvas.loadImage(req.files[0].path)

  // const resultsRef = await faceapi
  //   .detectAllFaces(referenceImage, faceDetectionOptions)
  //   .withFaceLandmarks()
  //   .withFaceDescriptors()

  // const resultsQuery = await faceapi
  //   .detectAllFaces(queryImage, faceDetectionOptions)
  //   .withFaceLandmarks()
  //   .withFaceDescriptors()

  // const faceMatcher = new faceapi.FaceMatcher(resultsRef)
  // const labels = faceMatcher.labeledDescriptors.map(ld => ld.label)

  // const refDrawBoxes = resultsRef
  //   .map(res => res.detection.box)
  //   .map((box, i) => new faceapi.draw.DrawBox(box, { label: labels[i] }))
  // const outRef = faceapi.createCanvasFromMedia(referenceImage)
  // refDrawBoxes.forEach(drawBox => drawBox.draw(outRef))

  // const queryDrawBoxes = resultsQuery.map(res => {
  //   const bestMatch = faceMatcher.findBestMatch(res.descriptor)
  //   return new faceapi.draw.DrawBox(res.detection.box, {
  //     label: bestMatch.toString()
  //   })
  // })
  // const outQuery = faceapi.createCanvasFromMedia(queryImage)
  // queryDrawBoxes.forEach(drawBox => drawBox.draw(outQuery))
  // const out = await faceapi.createCanvasFromMedia(queryImage)
  // faceapi.draw.drawDetections(out, resultsQuery)

  // await saveFile(`reference-${ulid()}.jpg`, outRef.toBuffer('image/jpeg'))
  // await saveFile(`query-${ulid()}.jpg`, outQuery.toBuffer('image/jpeg'))
  res.sendStatus(200)
}
