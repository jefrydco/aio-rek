import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'

export const isDark = color => {
  if (!color) {
    return
  }
  color = color.toString()
  return isDarkColor(color)
}

export const getMaterialColor = string => {
  if (!string) {
    return
  }
  string = string.toString()
  return materialColorHash(string)
}

export const getInitials = string => {
  if (!string) {
    return
  }
  string = string.toString()
  return initials(string)
}
