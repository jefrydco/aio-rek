/* eslint-disable camelcase */
import * as faceapi from 'face-api.js'
import capitalize from 'lodash/fp/capitalize'
import isEmpty from 'lodash/fp/isEmpty'
import pickBy from 'lodash/fp/pickBy'

const config = {
  useTiny: false,

  detections: {
    boxColor: '#ff5722',
    textColor: '#ff5722',
    lineWidth: 2,
    fontSize: 20,
    fontStyle: 'Roboto'
  },

  expressions: {
    minConfidence: 0.7
  },

  landmarks: {
    drawLines: true,
    lineWidth: 1,
    color: '#ff5722'
  },

  descriptors: {
    withDistance: true
  }
}

export const types = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  SET_FACES: 'SET_FACES',
  SET_FACE_MATCHER: 'SET_FACE_MATCHER',
  SET_MIN_CONFIDENCE: 'SET_MIN_CONFIDENCE'
}

export const state = () => ({
  faces: [],
  isLoading: false,
  isLoaded: false,
  faceMatcher: null,
  minConfidence: 0.99
})

export const mutations = {
  [types.LOADING](state) {
    state.isLoading = true
  },
  [types.LOADED](state) {
    state.isLoading = false
    state.isLoaded = true
  },
  [types.SET_FACES](state, faces) {
    state.faces = faces
  },
  [types.SET_FACE_MATCHER](state, faceMatcher) {
    state.faceMatcher = faceMatcher
  },
  [types.SET_MIN_CONFIDENCE](state, minConfidence) {
    state.minConfidence = minConfidence
  }
}

export const actions = {
  async getModels({ commit, state }) {
    if (!state.loading && !state.loaded) {
      commit(types.LOADING)
      await Promise.all([
        faceapi.loadSsdMobilenetv1Model('/models'),
        faceapi.loadFaceRecognitionModel('/models'),
        faceapi.loadFaceLandmarkModel('/models'),
        faceapi.loadFaceExpressionModel('/models'),
        faceapi.loadAgeGenderModel('/models')
      ])
      await commit(types.LOADED)
    }
  },
  async getFaceDescriptors(
    { commit, state },
    {
      image: { path }
    }
  ) {
    try {
      const img = await faceapi.fetchImage(path)
      const { descriptor } = await faceapi
        .detectSingleFace(
          img,
          new faceapi.SsdMobilenetv1Options({
            minConfidence: state.minConfidence
          })
        )
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptor()
      if (descriptor) {
        console.log(descriptor)
        return descriptor
      }
      return false
    } catch (error) {
      console.log(error)
    }
  },
  getFaceMatcher({ commit, state }, { datasets = [] }) {
    console.log('faceMatcher: store', datasets)
    const labeledDescriptors = []
    datasets.forEach(({ id, images }) => {
      if (images.length > 0) {
        const descriptors = []
        images.forEach(({ has_descriptor, descriptor: { descriptor } }) => {
          if (!isEmpty(descriptor) && has_descriptor) {
            const desc = Object.values(descriptor).map(_descItem =>
              parseFloat(_descItem)
            )
            descriptors.push(new Float32Array(desc))
          }
        })
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(id, descriptors)
        )
      }
    })
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
    commit(types.SET_FACE_MATCHER, faceMatcher)
  },
  async getFaceDetections(
    { commit, state },
    {
      canvasEl,
      options: {
        isRecognitionEnabled = true,
        isLandmarksEnabled = true,
        isExpressionEnabled = true,
        isAgeGenderEnabled = true,
        isSingleFace = true
      } = {
        isRecognitionEnabled: true,
        isLandmarksEnabled: true,
        isExpressionEnabled: true,
        isAgeGenderEnabled: true,
        isSingleFace: true
      }
    }
  ) {
    if (isSingleFace) {
      let promise = faceapi.detectSingleFace(
        canvasEl,
        new faceapi.SsdMobilenetv1Options({
          minConfidence: state.minConfidence
        })
      )
      if (isLandmarksEnabled || isRecognitionEnabled) {
        promise = promise.withFaceLandmarks(state.useTiny)
      }
      if (isExpressionEnabled) {
        promise = promise.withFaceExpressions()
      }
      if (isAgeGenderEnabled) {
        promise = promise.withAgeAndGender()
      }
      if (isRecognitionEnabled) {
        promise = promise.withFaceDescriptor()
      }
      const detections = await promise
      return detections
    }
    let promise = faceapi.detectAllFaces(
      canvasEl,
      new faceapi.SsdMobilenetv1Options({
        minConfidence: state.minConfidence
      })
    )
    if (isLandmarksEnabled || isRecognitionEnabled) {
      promise = promise.withFaceLandmarks(state.useTiny)
    }
    if (isExpressionEnabled) {
      promise = promise.withFaceExpressions()
    }
    if (isAgeGenderEnabled) {
      promise = promise.withAgeAndGender()
    }
    if (isRecognitionEnabled) {
      promise = promise.withFaceDescriptors()
    }
    const detections = await promise
    return detections
  },
  async getBestMatch(
    { commit, state },
    {
      descriptor,
      options: { isRecognitionEnabled = true } = {
        isRecognitionEnabled: true
      }
    }
  ) {
    if (descriptor && isRecognitionEnabled && state.faceMatcher) {
      console.log('getBestMatch: store: descriptor', descriptor)
      const bestMatch = await state.faceMatcher.findBestMatch(descriptor)
      console.log('getBestMatch: store: bestMatch', bestMatch)
      return bestMatch
    }
    return null
  },
  drawBestMatch(
    { commit, state },
    {
      canvasEl,
      canvasCtx,
      detection,
      options: {
        isDetectionEnabled = true,
        isRecognitionEnabled = true,
        isLandmarksEnabled = true,
        isExpressionEnabled = true,
        isAgeGenderEnabled = true
      } = {
        isDetectionEnabled: true,
        isRecognitionEnabled: true,
        isLandmarksEnabled: true,
        isExpressionEnabled: true,
        isAgeGenderEnabled: true
      }
    }
  ) {
    canvasCtx.fillStyle = config.detections.textColor
    canvasCtx.font =
      config.detections.fontSize + 'px ' + config.detections.fontStyle
    const padText = 9 + config.detections.lineWidth

    if (detection.detection) {
      const box = detection.detection.box
      if (isDetectionEnabled) {
        new faceapi.draw.DrawBox(box, {
          lineWidth: config.detections.lineWidth,
          boxColor: config.detections.boxColor
        }).draw(canvasCtx)

        let name = 'Unknown'
        if (detection.detected) {
          name = detection.detected.name
        }
        canvasCtx.fillText(
          name,
          box.x + padText,
          box.y + box.height + padText + config.detections.fontSize * 0.7
        )
      }
      if (isLandmarksEnabled && detection.landmarks) {
        new faceapi.draw.DrawFaceLandmarks(detection.landmarks, {
          lineColor: config.detections.boxColor,
          pointColor: config.detections.boxColor
        }).draw(canvasEl)
      }
      if (isAgeGenderEnabled && detection.age && detection.gender) {
        canvasCtx.fillText(
          `${capitalize(detection.gender)}, Age: ${Math.round(detection.age)}`,
          box.x + padText,
          box.y + box.height + 3 * padText + config.detections.fontSize * 0.7
        )
      }
      if (isExpressionEnabled && detection.expressions) {
        const emotions = Object.keys(
          pickBy(
            value => value >= config.expressions.minConfidence,
            detection.expressions
          )
        )
          .map(emotion => capitalize(emotion))
          .join(' & ')
        canvasCtx.fillText(
          emotions,
          box.x + padText,
          box.y + box.height + 5 * padText + config.detections.fontSize * 0.7
        )
      }
    }
  }
}
