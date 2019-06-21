import * as faceapi from 'face-api.js'
import capitalize from 'lodash/fp/capitalize'

export const types = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  SET_FACES: 'SET_FACES',
  SET_FACE_MATCHER: 'SET_FACE_MATCHER'
}

export const state = () => ({
  faces: [],
  isLoading: false,
  isLoaded: false,
  faceMatcher: null,

  useTiny: false,

  detections: {
    scoreThreshold: 0.3,
    inputSize: 704,
    boxColor: '#ff5722',
    textColor: '#ff5722',
    lineWidth: 2,
    fontSize: 20,
    fontStyle: 'Roboto'
  },

  expressions: {
    minConfidence: 0.3
  },

  landmarks: {
    drawLines: true,
    lineWidth: 1,
    color: '#ff5722'
  },

  descriptors: {
    withDistance: true
  }
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
        faceapi.loadAgeGenderModel('/models')
      ])
      await commit(types.LOADED)
    }
  },
  async getFaceDescriptors({ commit, state }, { images }) {
    const descriptors = await Promise.all(
      images.map(async ({ id, path }) => {
        const img = await faceapi.fetchImage(path)
        const descriptor = await faceapi.computeFaceDescriptor(img)
        return {
          image_id: id,
          descriptor
        }
      })
    )
    console.log(descriptors)
    return descriptors
  },
  getFaceMatcher({ commit, state }, { lecturers = [] }) {
    const labeledDescriptors = []
    lecturers.forEach(({ id, images }) => {
      if (images.length > 0) {
        const descriptors = images.map(({ descriptor: { descriptor } }) => {
          const desc = Object.values(descriptor).map(_descItem =>
            parseFloat(_descItem)
          )
          return new Float32Array(desc)
        })
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(id, descriptors)
        )
      }
    })
    // console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
    commit(types.SET_FACE_MATCHER, faceMatcher)
    // console.log(faceMatcher)
    return faceMatcher
  },
  async getFaceDetections(
    { commit, state },
    {
      canvasEl,
      options: {
        descriptorsEnabled = true,
        landmarksEnabled = true,
        ageGenderEnabled = true
      } = {
        descriptorsEnabled: true,
        landmarksEnabled: true,
        ageGenderEnabled: true
      }
    }
  ) {
    let promise = faceapi.detectAllFaces(
      canvasEl,
      new faceapi.SsdMobilenetv1Options({
        scoreThreshold: state.detections.scoreThreshold,
        inputSize: state.detections.inputSize
      })
    )
    if (landmarksEnabled || descriptorsEnabled) {
      promise = promise.withFaceLandmarks()
    }
    if (ageGenderEnabled) {
      promise = promise.withAgeAndGender()
    }
    if (descriptorsEnabled) {
      promise = promise.withFaceDescriptors()
    }
    const detections = await promise
    return detections
  },
  async getBestMatch(
    { commit, state },
    {
      descriptor,
      options: { descriptorsEnabled = true } = {
        descriptorsEnabled: true
      }
    }
  ) {
    if (descriptorsEnabled) {
      const bestMatch = await state.faceMatcher.findBestMatch(descriptor)
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
        detectionsEnabled = true,
        descriptorsEnabled = true,
        landmarksEnabled = true,
        ageGenderEnabled = true
      } = {
        detectionsEnabled: true,
        descriptorsEnabled: true,
        landmarksEnabled: true,
        ageGenderEnabled: true
      }
    }
  ) {
    const padText = 9 + state.detections.lineWidth

    if (detectionsEnabled && detection.detection) {
      const box = detection.detection.box
      new faceapi.draw.DrawBox(box, {
        lineWidth: state.detections.lineWidth,
        boxColor: state.detections.boxColor
      }).draw(canvasCtx)

      let text = 'Unknown'
      if (detection.detected) {
        text = detection.detected.name
      }
      canvasCtx.fillStyle = state.detections.textColor
      canvasCtx.font =
        state.detections.fontSize + 'px ' + state.detections.fontStyle
      canvasCtx.fillText(
        text,
        box.x + padText,
        box.y + box.height + padText + state.detections.fontSize * 0.7
      )
    }
    if (landmarksEnabled && detection.landmarks) {
      new faceapi.draw.DrawFaceLandmarks(detection.landmarks, {
        lineColor: state.detections.boxColor,
        pointColor: state.detections.boxColor
      }).draw(canvasEl)
    }
    if (ageGenderEnabled && detection.age && detection.gender) {
      const box = detection.detection.box
      canvasCtx.fillText(
        `${capitalize(detection.gender)}, Age: ${Math.round(detection.age)}`,
        box.x + padText,
        box.y + box.height + 3 * padText + state.detections.fontSize * 0.7
      )
    }
  }
}
