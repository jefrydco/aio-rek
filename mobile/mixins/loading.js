import { types } from "~/store";

export default {
  computed: {
    loading: {
      get() {
        return this.$store.state.loading;
      },
      set(loading) {
        this.$store.commit(types.SET_LOADING, loading);
      }
    }
  }
};
