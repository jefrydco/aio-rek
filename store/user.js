export const types = {
  SET_USER: 'SET_USER'
}

export const state = () => ({
  user: null
})

export const getters = {
  isAuth(state) {
    return state.user !== null
  }
}

export const mutations = {
  [types.SET_USER](state, user) {
    state.user = user
  }
}
