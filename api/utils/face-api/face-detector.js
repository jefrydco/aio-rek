import * as faceapi from 'face-api.js'

export const faceDetectionNet = faceapi.nets.ssdMobilenetv1
// export const faceDetectionNet = faceapi.nets.tinyFaceDetector
// export const faceDetectionNet = faceapi.nets.mtcnn

// SsdMobilenetv1Options
const minConfidence = 0.5

// TinyFaceDetectorOptions
const inputSize = 384
const scoreThreshold = 0.5

// MtcnnOptions
const minFaceSize = 50
const scaleFactor = 0.8

function getFaceDetectorOptions(net) {
  if (net === faceapi.nets.ssdMobilenetv1) {
    return new faceapi.SsdMobilenetv1Options({ minConfidence })
  } else if (net === faceapi.nets.tinyFaceDetector) {
    return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
  } else {
    return new faceapi.MtcnnOptions({ minFaceSize, scaleFactor })
  }
}

export const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet)
