export const types = {
  SET_USER: "SET_USER",
  SET_LOADING: "SET_LOADING"
};

export const state = () => ({
  user: null,
  loading: true
});

export const getters = {};

export const mutations = {
  [types.SET_USER](state, payload) {
    state.user = payload;
  },
  [types.SET_LOADING](state, payload) {
    state.loading = payload;
  }
};

export const actions = {};
