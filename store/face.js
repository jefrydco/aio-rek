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

  directions: {
    scoreThreshold: 0.3,
    inputSize: 720,
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
        faceapi.loadFaceRecognitionModel('/models'),
        faceapi.loadFaceLandmarkModel('/models'),
        faceapi.loadFaceDetectionModel('/models'),
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
          image: id,
          descriptor
        }
      })
    )
    console.log(descriptors)
    return descriptors
  }
}
