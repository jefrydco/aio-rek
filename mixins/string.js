import pluralize from 'pluralize'

export default {
  methods: {
    pluralize(string, count = 0, inclusive = false) {
      if (!string) {
        return
      }
      string = string.toString()
      return pluralize(string, count, inclusive)
    },
    removeTitle(string) {
      if (!string) {
        return null
      }
      string = string.toString()
      return string.split(',')[0]
    }
  }
}
