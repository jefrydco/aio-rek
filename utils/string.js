export const removeTitle = string => {
  if (!string) {
    return null
  }
  string = string.toString()
  return string.split(',')[0]
}
