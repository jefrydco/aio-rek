export const types = {
  RESET_DETECTION: 'RESET_DETECTION',
  SET_DETECTED_LECTURER: 'SET_DETECTED_LECTURER',
  PUSH_DETECTED_STUDENT: 'PUSH_DETECTED_STUDENT',
  SET_ATTENDANCE: 'SET_ATTENDANCE'
}

export const state = () => ({
  attendance: null,
  detectedLecturer: null,
  detectedStudents: []
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
  [types.PUSH_DETECTED_STUDENT](state, detectedStudent = null) {
    if (detectedStudent) {
      if (!state.detectedStudents.includes(detectedStudent)) {
        state.detectedStudents.push(detectedStudent)
      }
    } else {
      state.detectedStudents = []
    }
  },
  [types.SET_ATTENDANCE](state, attendance = null) {
    state.attendance = attendance
  },
  [types.RESET_DETECTION](state) {
    state.detectedLecturer = null
    state.detectedStudents = []
    state.attendance = null
  }
}
