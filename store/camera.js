const isCameraSupported = () => {
  return (
    !state.videoStream &&
    navigator &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  )
}

export const types = {
  START: 'START',
  STOP: 'STOP',
  SET_CAMERAS: 'SET_CAMERAS',
  SET_SELECTED_CAMERA: 'SET_SELECTED_CAMERA'
}

export const state = () => ({
  videoStream: null,
  cameras: [],
  selectedCamera: null
})

export const getters = {
  isCameraStarted(state) {
    return !!state.videoStream
  }
}

export const mutations = {
  [types.START](state, videoStream) {
    state.videoStream = videoStream
  },
  [types.STOP](state) {
    if (state.videoStream) {
      state.videoStream.getTracks().forEach(track => track.stop())
      state.videoStream = null
    }
  },
  [types.SET_CAMERAS](state, cameras) {
    state.cameras = cameras
  },
  [types.SET_SELECTED_CAMERA](state, selectedCamera) {
    state.selectedCamera = selectedCamera
  }
}

export const actions = {
  async startCamera({ commit, state }, deviceId) {
    if (isCameraSupported()) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } }
        })
        commit(types.START, stream)
        return stream
      } catch (error) {
        console.log(error)
        throw error
      }
    } else {
      throw new Error(`This browser doesn't support WebRTC`)
    }
  },
  stopCamera({ commit }) {
    commit(types.STOP)
  },
  async getCameras({ commit }) {
    if (isCameraSupported()) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter(device => device.kind === 'videoinput')
        if (cameras.length > 0) {
          // const [{ deviceId }] = cameras
          commit(types.SET_CAMERAS, cameras)
          // commit(types.SET_SELECTED_CAMERA, deviceId)
        }
        return cameras
      } catch (error) {
        this.$handleError(error)
      }
    } else {
      throw new Error(`This browser doesn't support WebRTC`)
    }
  }
}
