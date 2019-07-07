<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Presences</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="accent" @click="fetchPresences">
        Refresh
      </v-btn>
      <v-btn color="primary" @click="onTrigger">
        Create Presence
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="presences"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="isLoading"
      >
        <template #items="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1">
              <app-avatar
                :name="item.student.name"
                :image="item.image"
                text-class="caption"
              />
            </td>
            <td class="py-1 body-2">
              {{ item.student.name }}
            </td>
            <td class="py-1 body-2">
              {{
                item.attendance ? item.attendance.schedule.lecturer.name : ''
              }}
            </td>
            <td class="py-1 body-2">
              {{ item.attendance ? item.attendance.room.name : '' }}
            </td>
            <td class="py-1 body-2 text-xs-center">
              <v-chip v-if="item.is_late" color="error" text-color="white">
                <v-avatar class="error darken-3">
                  <v-icon>close</v-icon>
                </v-avatar>
                <span>Late</span>
              </v-chip>
              <v-chip v-else="" color="info" text-color="white">
                <v-avatar class="info darken-3">
                  <v-icon>check</v-icon>
                </v-avatar>
                <span>On Time</span>
              </v-chip>
            </td>
            <td class="py-1 body-2 text-xs-center">
              <v-chip :color="getStatusColor(item.status)" text-color="white">
                <v-avatar :class="`${getStatusColor(item.status)} darken-3`">
                  <v-icon>{{ getStatusIcon(item.status) }}</v-icon>
                </v-avatar>
                <span>{{ upperFirst(item.status) }}</span>
              </v-chip>
            </td>
            <td class="py-1 body-2">
              {{ item.datetime ? $moment(item.datetime).format('llll') : '' }}
            </td>
            <td class="py-1 body-2">
              <v-btn color="info" @click="onTriggerEnlargeImage($event, item)">
                Enlarge Image
              </v-btn>
              <v-btn color="primary" @click="onTrigger($event, item)">
                Edit
              </v-btn>
              <v-btn color="error" @click="onTriggerRemoving(item)">
                Delete
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog
        v-model="isCreatingOrEditingDialog"
        scrollable=""
        width="700"
        lazy=""
        @input="onClose"
      >
        <v-card>
          <v-toolbar color="primary" dark="" card="">
            <v-toolbar-title>
              <h3 class="title">
                {{ isEditing ? 'Edit' : 'Create' }} Presence
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onClose">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-container class="pa-0" fluid="" grid-list-xl="">
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="scheduleFilter.study_program_id"
                    v-validate="'required'"
                    :error-messages="errors.collect('study_program_id')"
                    :disabled="isLoading"
                    :items="studyPrograms"
                    item-text="name"
                    item-value="id"
                    label="Study Program"
                    data-vv-name="study_program_id"
                    data-vv-as="study program"
                    name="study_program_id"
                    required=""
                    clearable=""
                    outline=""
                    data-vv-value-path="scheduleFilter.study_program_id"
                  />
                </v-flex>
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="scheduleFilter.department_id"
                    v-validate="'required'"
                    :error-messages="errors.collect('department')"
                    :disabled="isLoading"
                    :items="departments"
                    item-text="name"
                    item-value="id"
                    label="Department"
                    data-vv-name="department"
                    data-vv-as="department"
                    name="department"
                    required=""
                    clearable=""
                    outline=""
                    data-vv-value-path="scheduleFilter.department_id"
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="scheduleFilter.major_id"
                    v-validate="'required'"
                    :error-messages="errors.collect('major_id')"
                    :disabled="isLoading"
                    :items="majors"
                    item-text="name"
                    item-value="id"
                    label="Major"
                    data-vv-name="major_id"
                    data-vv-as="major"
                    name="major_id"
                    required=""
                    clearable=""
                    outline=""
                    hint="Please choose the study program and department first"
                    data-vv-value-path="scheduleFilter.major_id"
                  />
                </v-flex>
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="scheduleFilter.group_id"
                    v-validate="'required'"
                    :error-messages="errors.collect('group_id')"
                    :disabled="isLoading"
                    :items="groups"
                    item-text="name"
                    item-value="id"
                    label="Group"
                    data-vv-name="group_id"
                    data-vv-as="group"
                    name="group_id"
                    required=""
                    clearable=""
                    outline=""
                    data-vv-value-path="scheduleFilter.group_id"
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="scheduleFilter.grade"
                    v-validate="'required'"
                    :error-messages="errors.collect('grade')"
                    :disabled="isLoading"
                    :items="grades"
                    item-text="name"
                    item-value="id"
                    label="Grade"
                    data-vv-name="grade"
                    data-vv-as="grade"
                    name="grade"
                    required=""
                    clearable=""
                    outline=""
                    hint="Please choose the study program first"
                    data-vv-value-path="scheduleFilter.grade"
                  />
                </v-flex>
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="scheduleFilter.lecturer_id"
                    v-validate="'required'"
                    :error-messages="errors.collect('lecturer_id')"
                    :disabled="isLoading"
                    :items="lecturers"
                    item-text="name"
                    item-value="id"
                    label="Lecturer"
                    data-vv-name="lecturer_id"
                    data-vv-as="lecturer"
                    name="lecturer_id"
                    required=""
                    clearable=""
                    outline=""
                    hint="Please choose the study program first"
                    data-vv-value-path="scheduleFilter.lecturer_id"
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="attendanceFilter.schedule_id"
                    v-validate="'required'"
                    :error-messages="errors.collect('schedule_id')"
                    :disabled="isLoading"
                    :items="schedules"
                    item-value="id"
                    label="Schedule"
                    data-vv-name="schedule_id"
                    data-vv-as="schedule"
                    name="schedule_id"
                    required=""
                    clearable=""
                    outline=""
                    hint="Please choose the study program, department, major, group, grade and lecturer first"
                    data-vv-value-path="attendanceFilter.schedule_id"
                  >
                    <template #selection="{ item, selected }">
                      {{ item.subject.name }}
                    </template>
                    <template #item="{ item }">
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ item.subject.name }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          {{ item.room.name }} -
                          {{
                            item.start_time
                              ? $moment(item.start_time, 'HH:mm:ss').format(
                                  'HH:mm'
                                )
                              : ''
                          }}
                          -
                          {{
                            item.end_time
                              ? $moment(item.end_time, 'HH:mm:ss').format(
                                  'HH:mm'
                                )
                              : ''
                          }}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="attendanceFilter.room_id"
                    v-validate="'required'"
                    :error-messages="errors.collect('room_id')"
                    :disabled="isLoading"
                    :items="rooms"
                    item-value="id"
                    item-text="name"
                    label="Room"
                    data-vv-name="room_id"
                    data-vv-as="room"
                    name="room_id"
                    required=""
                    clearable=""
                    outline=""
                    data-vv-value-path="attendanceFilter.room_id"
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="presence.attendance_id"
                    v-validate="'required'"
                    :error-messages="errors.collect('attendance_id')"
                    :disabled="isLoading"
                    :items="attendances"
                    item-value="id"
                    item-text="schedule.lecturer.name"
                    label="Attendance"
                    data-vv-name="attendance_id"
                    data-vv-as="attendance"
                    name="attendance_id"
                    required=""
                    clearable=""
                    outline=""
                    data-vv-value-path="presence.attendance_id"
                  >
                    <template #selection="{ item, selected }">
                      <v-chip :selected="selected">
                        <app-avatar
                          :image="item.schedule.lecturer.image"
                          :name="item.schedule.lecturer.name"
                          text-class="caption"
                        />
                        <span>{{ item.schedule.lecturer.name }}</span>
                      </v-chip>
                    </template>
                    <template #item="{ item }">
                      <v-list-tile-avatar>
                        <app-avatar
                          :image="item.image"
                          :name="item.schedule.lecturer.name"
                          text-class="caption"
                        />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ item.schedule.lecturer.name }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          {{
                            item.start_datetime
                              ? $moment(item.start_datetime).format('llll')
                              : ''
                          }}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="presence.student_id"
                    v-validate="'required'"
                    :error-messages="errors.collect('student_id')"
                    :disabled="isLoading"
                    :items="students"
                    item-value="id"
                    item-text="name"
                    label="Student"
                    data-vv-name="student_id"
                    data-vv-as="student"
                    name="student_id"
                    required=""
                    clearable=""
                    outline=""
                    data-vv-value-path="presence.student_id"
                  >
                    <template #selection="{ item, selected }">
                      <v-chip :selected="selected">
                        <app-avatar
                          :image="item.image"
                          :name="item.name"
                          text-class="caption"
                        />
                        <span>{{ item.name }}</span>
                      </v-chip>
                    </template>
                    <template #item="{ item }">
                      <v-list-tile-avatar>
                        <app-avatar
                          :image="item.image"
                          :name="item.name"
                          :size="36"
                          text-class="caption"
                        />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ item.name }}
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </v-autocomplete>
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <div>
                    <input
                      ref="image"
                      style="display: none"
                      type="file"
                      name="image"
                      accept="image/jpeg,image/jpg"
                      @change="onImageSelected"
                    />
                    <v-btn
                      :disabled="isLoading"
                      :loading="isLoading"
                      color="primary"
                      @click="onSelectImage"
                    >
                      Select Image
                    </v-btn>
                    <span>{{ image.name }}</span>
                  </div>
                  <v-img alt="Image" :src="image.url">
                    <template #placeholder="">
                      <v-layout
                        fill-height=""
                        align-center=""
                        justify-center=""
                        ma-0=""
                      >
                        <v-progress-circular
                          indeterminate=""
                          color="grey lighten-5"
                        />
                      </v-layout>
                    </template>
                  </v-img>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              flat=""
              @click="onClose"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="primary"
              flat=""
              @click="onCreateOrEdit"
            >
              {{ isEditing ? 'Edit' : 'Save' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isRemovingDialog"
        width="350"
        scrollable=""
        lazy=""
        @input="onCloseRemoving"
      >
        <v-card>
          <v-toolbar color="primary" dark="" card="">
            <v-toolbar-title>
              <h3 class="title">
                Delete Confirmation
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onCloseRemoving">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <div class="body-2">
              Are you sure you want to remove {{ presence.student.name }}?
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              flat=""
              @click="onCloseRemoving"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="error"
              flat=""
              @click="onRemove(presence)"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isEnlargingImage" width="700" scrollable="" lazy="">
        <v-card>
          <v-toolbar color="primary" dark="" card="">
            <v-toolbar-title>
              <h3 class="title">
                Image
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="isEnlargingImage = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-container class="pa-0" fluid="" grid-list-xl="">
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <v-img
                    v-if="presence.image"
                    :src="enlargedImage.url"
                    :alt="enlargedImage.name"
                  >
                    <template #placeholder="">
                      <v-layout
                        fill-height=""
                        align-center=""
                        justify-center=""
                        ma-0=""
                      >
                        <v-progress-circular
                          indeterminate=""
                          color="grey lighten-5"
                        />
                      </v-layout>
                    </template>
                  </v-img>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              flat=""
              @click="isEnlargingImage = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable camelcase */
import toFormData from 'json-form-data'
import cloneDeep from 'lodash/fp/cloneDeep'
import upperFirst from 'lodash/fp/upperFirst'
import { fileReader } from '~/utils/file'

export default {
  head() {
    return {
      title: 'Presences'
    }
  },
  data() {
    return {
      isStartDate: false,
      isStartTime: false,
      isEndDate: false,
      isEndTime: false,
      isEnlargingImage: false,
      isCreatingOrEditingDialog: false,
      isEditing: false,
      isRemovingDialog: false,
      default: {
        id: null,
        attendance_id: null,
        student_id: null,
        student: {
          name: null
        },
        is_late: false,
        status: 'alpha',
        image: null
      },
      presence: {
        id: null,
        attendance_id: null,
        student_id: null,
        student: {
          name: null
        },
        is_late: false,
        status: 'alpha',
        image: null
      },
      presences: [],
      filter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: ''
      },
      isLoading: false,
      headers: [
        { text: 'Image', value: 'image', sortable: false },
        { text: 'Name', value: 'student.name' },
        { text: 'Lecturer', value: 'attendance.schedule.lecturer.name' },
        { text: 'Room', value: 'attendance.room.name' },
        { text: 'Is late?', value: 'is_late', align: 'center' },
        { text: 'Status', value: 'status' },
        { text: 'Datetime', value: 'datetime' },
        { text: 'Action', align: 'center', sortable: false }
      ],
      rowsPerPageItems: [25, 50, 75, 100],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 25,
        sortBy: '-datetime',
        totalItems: 25
      },
      totalItems: 0,
      students: [],
      attendances: [],
      schedules: [],
      studyPrograms: [],
      departments: [],
      majors: [],
      groups: [],
      lecturers: [],
      rooms: [],
      scheduleFilter: {
        study_program_id: null,
        department_id: null,
        major_id: null,
        group_id: null,
        grade: null,
        lecturer_id: null
      },
      attendanceFilter: {
        schedule_id: null,
        room_id: null
      },
      image: {
        name: '',
        url: '',
        file: null
      },
      enlargedImage: {
        name: '',
        url: ''
      }
    }
  },
  computed: {
    grades() {
      const grades = []
      const studyProgram = this.studyPrograms.find(
        ({ id }) => id === this.scheduleFilter.study_program_id
      )
      if (studyProgram && studyProgram.name === 'D3') {
        return ['1', '2', '3']
      }
      if (studyProgram && studyProgram.name === 'D4') {
        return ['1', '2', '3', '4']
      }
      if (studyProgram && studyProgram.name === 'Pascasarjana') {
        return ['1', '2']
      }
      return grades
    },
    getStatusColor() {
      return status => {
        switch (status) {
          case 'alpha':
            return 'error'
          case 'sick':
            return 'info'
          case 'present':
            return 'success'
          default:
            return 'error'
        }
      }
    },
    getStatusIcon() {
      return status => {
        switch (status) {
          case 'alpha':
            return 'close'
          case 'sick':
            return 'priority_high'
          case 'present':
            return 'check'
          default:
            return 'error'
        }
      }
    },
    upperFirst() {
      return string => {
        if (!string) {
          return ''
        }
        string = string.toString()
        return upperFirst(string)
      }
    }
  },
  watch: {
    pagination: {
      handler({ descending, page, rowsPerPage, sortBy }) {
        if (sortBy) {
          if (sortBy.includes('.name')) {
            sortBy = `${sortBy.replace('.name', '')}_id`
          }
        }
        if (descending) {
          sortBy = `-${sortBy}`
        }
        this.fetchPresences({
          orderBy: sortBy,
          limit: rowsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * rowsPerPage
        })
      },
      deep: true
    },
    scheduleFilter: {
      handler({
        study_program_id,
        department_id,
        major_id,
        group_id,
        grade,
        lecturer_id
      }) {
        if (study_program_id && department_id) {
          this.fetchMajors({
            study_program_id,
            department_id
          })
        } else {
          this.majors = []
        }
        if (
          study_program_id &&
          department_id &&
          major_id &&
          group_id &&
          grade &&
          lecturer_id
        ) {
          this.fetchSchedules({
            study_program_id,
            major_id,
            group_id,
            grade,
            lecturer_id
          })
        }
        if (study_program_id && major_id && group_id && grade) {
          this.fetchStudents({
            study_program_id,
            major_id,
            group_id,
            grade
          })
        }
      },
      deep: true
    },
    attendanceFilter: {
      handler({ schedule_id, room_id }) {
        if (schedule_id && room_id) {
          this.fetchAttendances({
            schedule_id,
            room_id
          })
        }
      },
      deep: true
    },
    'image.file': function(file) {
      this.presence.image = file
    }
  },
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const [
        { rowCount, presences, ...filter },
        { studyPrograms },
        { departments },
        { groups },
        { rooms },
        { lecturers }
      ] = await Promise.all([
        $api.presences.fetchPage({
          orderBy: '-datetime',
          limit: 25,
          offset: 0,
          withRelated:
            'student,attendance.schedule.major,attendance.schedule.lecturer,attendance.room'
        }),
        $api.studyPrograms.fetchPage({ limit: -1 }),
        $api.departments.fetchPage({ limit: -1 }),
        $api.groups.fetchPage({ limit: -1 }),
        $api.rooms.fetchPage({ limit: -1 }),
        $api.lecturers.fetchPage({ limit: -1 })
      ])
      return {
        filter,
        presences,
        studyPrograms,
        departments,
        groups,
        rooms,
        lecturers,
        totalItems: rowCount
      }
    } catch ({ response }) {
      $handleError(response)
    }
  },
  methods: {
    async fetchPresences(
      {
        orderBy = this.pagination.sortBy,
        limit = this.pagination.rowsPerPage, // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset = (this.pagination.page - 1) * this.pagination.rowsPerPage,
        descending = this.pagination.descending
      } = {
        orderBy: this.pagination.sortBy,
        limit: this.pagination.rowsPerPage,
        // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        descending: this.pagination.descending
      }
    ) {
      try {
        this.isLoading = true
        if (orderBy) {
          if (orderBy.includes('.name')) {
            orderBy = `${orderBy.replace('.name', '')}_id`
          }
        }
        if (descending) {
          orderBy = `-${orderBy}`
        }
        const {
          rowCount,
          presences,
          ...filter
        } = await this.$api.presences.fetchPage({
          orderBy,
          limit,
          offset,
          withRelated:
            'student,attendance.schedule.major,attendance.schedule.lecturer,attendance.room'
        })
        this.filter = filter
        this.totalItems = rowCount
        this.presences = presences
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchAttendances({ schedule_id, room_id }) {
      try {
        this.isLoading = true
        const { attendances } = await this.$api.attendances.fetchPage({
          schedule_id,
          room_id,
          limit: -1,
          withRelated: 'room,schedule.lecturer'
        })
        this.attendances = attendances
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchStudents({ study_program_id, major_id, group_id, grade }) {
      try {
        this.isLoading = true
        const { students } = await this.$api.students.fetchPage({
          study_program_id,
          major_id,
          group_id,
          grade,
          is_active: true,
          limit: -1
        })
        this.students = students
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchSchedules({
      study_program_id,
      major_id,
      group_id,
      grade,
      lecturer_id
    }) {
      try {
        this.isLoading = true
        const { schedules } = await this.$api.schedules.fetchPage({
          study_program_id,
          major_id,
          group_id,
          grade,
          lecturer_id,
          limit: -1,
          withRelated:
            'study_program,major.department,group,room,subject,lecturer'
        })
        this.schedules = schedules
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchRooms() {
      try {
        this.isLoading = true
        const { rooms } = await this.$api.rooms.fetchPage({ limit: -1 })
        this.rooms = rooms
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchDepartments() {
      try {
        this.isLoading = true
        const { departments } = await this.$api.departments.fetchPage({
          limit: -1
        })
        this.departments = departments
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchStudyPrograms() {
      try {
        this.isLoading = true
        const { studyPrograms } = await this.$api.studyPrograms.fetchPage({
          limit: -1
        })
        this.studyPrograms = studyPrograms
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    // eslint-disable-next-line
    async fetchMajors({ study_program_id, department_id }) {
      try {
        this.isLoading = true
        const { majors } = await this.$api.majors.fetchPage({
          study_program_id,
          department_id,
          limit: -1
        })
        this.majors = majors
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchGroups() {
      try {
        this.isLoading = true
        const { groups } = await this.$api.groups.fetchPage({ limit: -1 })
        this.groups = groups
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchLecturers() {
      try {
        this.isLoading = true
        const { lecturers } = await this.$api.lecturers.fetchPage({ limit: -1 })
        this.lecturers = lecturers
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async onTriggerEnlargeImage(event, item) {
      this.isEnlargingImage = true
      this.presence = { ...item }

      this.enlargedImage.name = item.student.name
      if (this.presence.image instanceof File) {
        this.enlargedImage.url = await fileReader(this.presence.image)
      } else {
        this.enlargedImage.url = item.image
      }
    },
    onTrigger(event, item) {
      this.isCreatingOrEditingDialog = true
      if (item) {
        this.isEditing = true
        this.presence = { ...item }

        this.image.url = item.image

        this.scheduleFilter.study_program_id =
          item.attendance.schedule.study_program_id
        this.scheduleFilter.department_id =
          item.attendance.schedule.major.department_id
        this.scheduleFilter.major_id = item.attendance.schedule.major_id
        this.scheduleFilter.group_id = item.attendance.schedule.group_id
        this.scheduleFilter.grade = item.attendance.schedule.grade
        this.scheduleFilter.lecturer_id = item.attendance.schedule.lecturer_id

        this.attendanceFilter.schedule_id = item.attendance.schedule_id
        this.attendanceFilter.room_id = item.attendance.room_id
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false
      this.$validator.reset()
      this.presence = { ...this.default }

      this.image.url = ''

      this.scheduleFilter.study_program_id = null
      this.scheduleFilter.department_id = null
      this.scheduleFilter.major_id = null
      this.scheduleFilter.group_id = null
      this.scheduleFilter.grade = null
      this.scheduleFilter.lecturer_id = null

      this.attendanceFilter.schedule_id = null
      this.attendanceFilter.room_id = null
    },
    async onCreateOrEdit(
      event,
      { _payload = this.presence, isEditing = false } = {
        _payload: this.presence,
        isEditing: false
      }
    ) {
      try {
        const valid = await this.$validator.validate()
        if (valid) {
          this.isLoading = true

          let payload = cloneDeep(_payload)

          delete payload.id
          delete payload.student
          delete payload.attendance

          if (this.isEditing) {
            payload = {
              ...payload,
              updated_at: new Date().toISOString()
            }
            if (payload.image instanceof File) {
              payload = toFormData(payload)
            } else {
              payload = {
                presence: {
                  ...payload
                }
              }
            }
            await this.$api.presences.update(_payload.id, payload, {
              lecturer_id: this.scheduleFilter.lecturer_id
            })
            this.$notify({
              kind: 'success',
              message: 'Presence is updated successfully'
            })
          } else {
            payload = toFormData(payload)
            await this.$api.presences.create(payload, {
              lecturer_id: this.scheduleFilter.lecturer_id
            })
            await this.$notify({
              kind: 'success',
              message: 'Presence is created successfully'
            })
          }

          await Promise.all([this.onClose(), this.fetchPresences()])
        } else {
          this.$notify({
            isError: true,
            message: 'Please fill all the required field to continue'
          })
        }
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    onTriggerRemoving(item) {
      this.isRemovingDialog = true
      this.presence = { ...item }
    },
    onCloseRemoving() {
      this.isRemovingDialog = false
      this.$validator.reset()
      this.presence = { ...this.default }
    },
    async onRemove(item) {
      try {
        this.isLoading = true

        await this.$api.presences.destroy(item.id)
        await Promise.all([
          this.fetchPresences(),
          this.onCloseRemoving(),
          this.$notify({
            kind: 'success',
            message: 'Presence is deleted successfully'
          })
        ])
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    onSelectImage() {
      this.$refs.image.click()
    },
    async onImageSelected(event) {
      try {
        const {
          target: { files = [] }
        } = event
        if (files.length > 0) {
          const [file] = files
          if (file !== null) {
            const url = await fileReader(file)
            this.image = {
              name: file.name,
              url,
              file
            }
          }
        }
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.$refs.image.value = null
      }
    },
    onRemoveImage() {
      this.$refs.image.value = null
      this.image = {
        name: '',
        url: '',
        file: null
      }
    }
  }
}
</script>
