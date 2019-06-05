export default file => {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.addEventListener('load', event => {
      resolve(fileReader.result)
    })
  })
}
