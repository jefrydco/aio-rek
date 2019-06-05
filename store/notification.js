export const types = {
  SET_NOTIFICATION: 'SET_NOTIFICATION'
}

export const state = () => ({
  isError: false,
  kind: 'info',
  message: null
})

export const mutations = {
  [types.SET_NOTIFICATION](
    state,
    { isError = false, kind = 'info', message = null }
  ) {
    state.isError = isError
    state.message = message
    if (isError) {
      state.kind = 'error'
    } else {
      state.kind = kind
    }
  }
}
