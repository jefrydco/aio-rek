'use strict'

// const apiFactory = require('../utils/api')
import apiFactory from '~/utils/api'

export default ({ $http }, inject) => {
  const createApi = apiFactory($http)

  const apiList = {
    attendances: createApi('attendances'),
    departments: createApi('departments'),
    groups: createApi('groups'),
    lecturers: createApi('lecturers'),
    presences: createApi('presences'),
    rooms: createApi('rooms'),
    schedules: createApi('schedules'),
    studentDescriptors: createApi('student-descriptors'),
    studentImages: createApi('student-images'),
    students: createApi('students'),
    studyPrograms: createApi('study-programs'),
    subjects: createApi('subjects'),
    users: createApi('users')
  }

  inject('api', apiList)
}
