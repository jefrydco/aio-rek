export const types = {
  SET_CONFIGURING: 'SET_CONFIGURING',
  SET_ROOM: 'SET_ROOM',
  SET_DEVICE: 'SET_DEVICE'
}

export const state = () => ({
  isConfiguring: true,
  room: null,
  device: null
})

export const getters = {
  isConfigured(state) {
    return state.room !== null && state.device !== null
  }
}

export const mutations = {
  [types.SET_CONFIGURING](state, isConfiguring) {
    state.isConfiguring = isConfiguring
  },
  [types.SET_ROOM](state, room) {
    state.room = room
  },
  [types.SET_DEVICE](state, device) {
    state.device = device
  }
}
