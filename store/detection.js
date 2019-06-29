import includes from 'lodash/fp/includes'

export const types = {
  RESET_DETECTION: 'RESET_DETECTION',
  LECTURER_DETECTING: 'LECTURER_DETECTING',
  LECTURER_DETECTED: 'LECTURER_DETECTED',
  SET_DETECTED_LECTURER: 'SET_DETECTED_LECTURER',
  STUDENTS_DETECTING: 'STUDENTS_DETECTING',
  STUDENTS_DETECTED: 'STUDENTS_DETECTED',
  SET_DETECTED_STUDENT: 'SET_DETECTED_STUDENT',
  SET_ATTENDANCE: 'SET_ATTENDANCE'
}

export const state = () => ({
  isLecturerDetecting: true,
  isLecturerDetected: false,
  detectedLecturer: null,
  isStudentsDetecting: false,
  isStudentsDetected: false,
  detectedStudents: [],
  attendance: null
})

export const getters = {
  isAttendanceStarted(state) {
    return state.attendance !== null
  }
}

export const mutations = {
  [types.LECTURER_DETECTING](state) {
    state.isLecturerDetecting = true
    state.isLecturerDetected = false
  },
  [types.LECTURER_DETECTED](state) {
    state.isLecturerDetecting = false
    state.isLecturerDetected = true
  },
  [types.SET_DETECTED_LECTURER](state, detectedLecturer = null) {
    state.detectedLecturer = detectedLecturer
  },
  [types.STUDENTS_DETECTING](state) {
    state.isStudentsDetecting = true
    state.isStudentsDetected = false
  },
  [types.STUDENTS_DETECTED](state) {
    state.isStudentsDetecting = false
    state.isStudentsDetected = true
  },
  [types.SET_DETECTED_STUDENT](state, detectedStudent = null) {
    if (detectedStudent) {
      if (!includes(detectedStudent.id, state.detectedStudents)) {
        state.detectedStudents.push(detectedStudent)
      }
    }
  },
  [types.SET_ATTENDANCE](state, attendance = null) {
    state.attendance = attendance
  },
  [types.RESET_DETECTION](state) {
    state.isLecturerDetecting = true
    state.isLecturerDetected = false
    state.detectedLecturer = null
    state.isStudentsDetecting = false
    state.isStudentsDetected = false
    state.detectedStudents = []
    state.attendance = null
  }
}
