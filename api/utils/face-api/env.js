// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import '@tensorflow/tfjs-node-gpu'

import * as faceapi from 'face-api.js'

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import canvas from 'canvas'

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

export { canvas }
