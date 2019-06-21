import * as faceapi from 'face-api.js'

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
    inputSize: 608,
    boxColor: '#00bcd4',
    textColor: '#ff472',
    lineWidth: 1,
    fontSize: 20,
    fontStyle: 'Roboto'
  },

  expressions: {
    minConfidence: 0.3
  },

  landmarks: {
    drawLines: true,
    lineWidth: 1,
    color: '#00bcd4'
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
    lecturers.forEach(({ name, images }) => {
      if (images.length > 0) {
        const descriptors = images.map(({ descriptor: { descriptor } }) => {
          const desc = Object.values(descriptor).map(_descItem =>
            parseFloat(_descItem)
          )
          return new Float32Array(desc)
        })
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(name, descriptors)
        )
      }
    })
    console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
    commit(types.SET_FACE_MATCHER, faceMatcher)
    console.log(faceMatcher)
    return faceMatcher
  },
  async getFaceDetections(
    { commit, state },
    {
      canvasEl,
      options: {
        descriptorsEnabled = true,
        landmarksEnabled = true,
        ageEnabled = true
      } = {
        descriptorsEnabled: true,
        landmarksEnabled: true,
        ageEnabled: true
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
    if (ageEnabled) {
      promise = promise.withAgeAndGender()
    }
    if (descriptorsEnabled) {
      promise = promise.withFaceDescriptors()
    }
    const detections = await promise
    return detections
  },
  async recognize(
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
      // const bestMatch = await true
      console.log(bestMatch)
      return bestMatch
    }
    return null
  }
}
