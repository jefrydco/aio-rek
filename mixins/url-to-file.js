export default {
  methods: {
    getFileName(url) {
      if (!url) {
        return
      }
      url = url.toString()
      return url
        .split('/')
        .pop()
        .replace(/#(.*?)$/, '')
        .replace(/\?(.*?)$/, '')
    },
    async getFileFromUrl(url) {
      // Taken from: https://stackoverflow.com/questions/44070437/how-to-get-a-file-or-blob-from-an-url-in-javascript
      if (!url) {
        return
      }
      url = url.toString()
      const filename = this.getFileName(url)
      const response = await fetch(url)
      const blob = await response.blob()
      return new File([blob], filename, {
        type: blob.type
      })
    }
  }
}
