import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'

export default {
  methods: {
    isDarkColor(color) {
      if (!color) {
        return
      }
      color = color.toString()
      return isDarkColor(color)
    },
    materialColorHash(string) {
      if (!string) {
        return
      }
      string = string.toString()
      return materialColorHash(string)
    },
    initials(string) {
      if (!string) {
        return
      }
      string = string.toString()
      return initials(string)
    }
  }
}
