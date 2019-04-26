export default {
  computed: {
    getColor() {
      return percentage => {
        if (percentage >= 0 && percentage <= 25) {
          return "rgba(244, 67, 54, 0.3)";
        } else if (percentage > 25 && percentage <= 50) {
          return "rgba(255, 193, 7, 0.3)";
        } else if (percentage > 50 && percentage <= 75) {
          return "rgba(33, 150, 243, 0.3)";
        } else if (percentage > 75 && percentage <= 100) {
          return "rgba(76, 175, 80, 0.3)";
        } else {
          return "rgba(244, 67, 54, 0.3)";
        }
      };
    }
  }
};
