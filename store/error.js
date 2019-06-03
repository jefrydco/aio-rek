export const types = {
  SET_ERROR: 'SET_ERROR'
}

export const state = () => ({
  isError: false,
  message: null
})

export const mutations = {
  [types.SET_ERROR](state, { isError = true, message }) {
    state.isError = isError
    state.message = message
  }
}
