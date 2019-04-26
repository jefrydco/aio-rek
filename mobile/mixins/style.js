export default {
  computed: {
    style() {
      const { xsOnly, smAndDown, mdAndDown } = this.$vuetify.breakpoint;
      if (xsOnly) {
        return {
          width: "100%"
        };
      }
      if (smAndDown) {
        return {
          width: "70%"
        };
      }
      if (mdAndDown) {
        return {
          width: "50%"
        };
      }
      return {
        width: "30%"
      };
    },
    toolbarStyle() {
      const { xsOnly, smAndDown, mdAndDown } = this.$vuetify.breakpoint;
      if (xsOnly) {
        return {
          left: "0"
        };
      }
      if (smAndDown) {
        return {
          left: "15.555555%"
        };
      }
      if (mdAndDown) {
        return {
          left: "25%"
        };
      }
      return {
        left: "35%"
      };
    }
  }
};
