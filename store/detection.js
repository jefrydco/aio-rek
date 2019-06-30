export const types = {
  RESET_DETECTION: 'RESET_DETECTION',
  SET_DETECTED_LECTURER: 'SET_DETECTED_LECTURER',
  SET_ATTENDANCE: 'SET_ATTENDANCE'
}

export const state = () => ({
  attendance: null,
  detectedLecturer: null
})

export const getters = {
  isAttendanceStarted(state) {
    return state.attendance !== null
  },
  isLecturerDetected(state) {
    return state.detectedLecturer !== null
  }
}

export const mutations = {
  [types.SET_DETECTED_LECTURER](state, detectedLecturer = null) {
    state.detectedLecturer = detectedLecturer
  },
  [types.SET_ATTENDANCE](state, attendance = null) {
    state.attendance = attendance
  },
  [types.RESET_DETECTION](state) {
    state.detectedLecturer = null
    state.attendance = null
  }
}
