<template>
  <v-card>
    <v-app-bar flat="">
      <v-toolbar-title>
        <h2 class="headline">Presences</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="ma-1" color="accent" @click="fetchPresences">
        Refresh
      </v-btn>
      <v-btn class="ma-1" color="primary" @click="onTrigger">
        Create Presence
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="presences"
        :footer-props="{
          'items-per-page-options': rowsPerPageItems
        }"
        :options.sync="pagination"
        :server-items-length="totalItems"
        :loading="isLoading"
      >
        <template #item="{ item, index }">
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
            <td class="py-1 body-2 text-center">
              <v-chip v-if="item.is_late" color="error" text-color="white">
                <v-avatar left="" class="error darken-3">
                  <v-icon>close</v-icon>
                </v-avatar>
                <span>Late</span>
              </v-chip>
              <v-chip v-else="" color="info" text-color="white">
                <v-avatar left="" class="info darken-3">
                  <v-icon>check</v-icon>
                </v-avatar>
                <span>On Time</span>
              </v-chip>
            </td>
            <td class="py-1 body-2 text-center">
              <v-chip :color="getStatusColor(item.status)" text-color="white">
                <v-avatar
                  left=""
                  :class="`${getStatusColor(item.status)} darken-3`"
                >
                  <v-icon>{{ getStatusIcon(item.status) }}</v-icon>
                </v-avatar>
                <span>{{ upperFirst(item.status) }}</span>
              </v-chip>
            </td>
            <td class="py-1 body-2">
              {{ item.datetime ? $moment(item.datetime).format('llll') : '' }}
            </td>
            <td class="py-1 body-2">
              <v-btn
                class="ma-1"
                color="info"
                @click="onTriggerEnlargeImage($event, item)"
              >
                Enlarge Image
              </v-btn>
              <v-btn
                class="ma-1"
                color="primary"
                @click="onTrigger($event, item)"
              >
                Edit
              </v-btn>
              <v-btn
                class="ma-1"
                color="error"
                @click="onTriggerRemoving(item)"
              >
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
        @input="onClose"
      >
        <v-card>
          <v-app-bar color="primary" dark="" flat="">
            <v-toolbar-title>
              <h3 class="title">
                {{ isEditing ? 'Edit' : 'Create' }} Presence
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onClose">
              <v-icon>close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text class="pt-5">
            <v-container class="pa-0" fluid="">
              <v-row class="flex-wrap">
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Study Program"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="scheduleFilter.study_program_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="studyPrograms"
                        item-text="name"
                        item-value="id"
                        label="Study Program"
                        name="study_program_id"
                        required=""
                        clearable=""
                        outlined=""
                      />
                    </validation-provider>
                  </validation-observer>
                </v-col>
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Department"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="scheduleFilter.department_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="departments"
                        item-text="name"
                        item-value="id"
                        label="Department"
                        name="department"
                        required=""
                        clearable=""
                        outlined=""
                      />
                    </validation-provider>
                  </validation-observer>
                </v-col>
              </v-row>
              <v-row class="flex-wrap">
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Major"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="scheduleFilter.major_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="majors"
                        item-text="name"
                        item-value="id"
                        label="Major"
                        name="major_id"
                        required=""
                        clearable=""
                        outlined=""
                        hint="Please choose the study program and department first"
                      />
                    </validation-provider>
                  </validation-observer>
                </v-col>
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Group"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="scheduleFilter.group_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="groups"
                        item-text="name"
                        item-value="id"
                        label="Group"
                        name="group_id"
                        required=""
                        clearable=""
                        outlined=""
                      />
                    </validation-provider>
                  </validation-observer>
                </v-col>
              </v-row>
              <v-row class="flex-wrap">
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Grade"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="scheduleFilter.grade"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="grades"
                        item-text="name"
                        item-value="id"
                        label="Grade"
                        name="grade"
                        required=""
                        clearable=""
                        outlined=""
                        hint="Please choose the study program first"
                      />
                    </validation-provider>
                  </validation-observer>
                </v-col>
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Lecturer"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="scheduleFilter.lecturer_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="lecturers"
                        item-text="name"
                        item-value="id"
                        label="Lecturer"
                        name="lecturer_id"
                        required=""
                        clearable=""
                        outlined=""
                        hint="Please choose the study program first"
                      />
                    </validation-provider>
                  </validation-observer>
                </v-col>
              </v-row>
              <v-row class="flex-wrap">
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Schedule"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="attendanceFilter.schedule_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="schedules"
                        item-value="id"
                        label="Schedule"
                        name="schedule_id"
                        required=""
                        clearable=""
                        outlined=""
                        hint="Please choose the study program, department, major, group, grade and lecturer first"
                      >
                        <template #selection="{ item }">
                          {{ item.subject.name }}
                        </template>
                        <template #item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ item.subject.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
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
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </validation-provider>
                  </validation-observer>
                </v-col>
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Room"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="attendanceFilter.room_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="rooms"
                        item-value="id"
                        item-text="name"
                        label="Room"
                        name="room_id"
                        required=""
                        clearable=""
                        outlined=""
                      />
                    </validation-provider>
                  </validation-observer>
                </v-col>
              </v-row>
              <v-row class="flex-wrap">
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Attendance"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="presence.attendance_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="attendances"
                        item-value="id"
                        item-text="schedule.lecturer.name"
                        label="Attendance"
                        name="attendance_id"
                        required=""
                        clearable=""
                        outlined=""
                      >
                        <template #selection="{ item, selected }">
                          <v-chip :input-value="selected">
                            <app-avatar
                              :image="item.schedule.lecturer.image"
                              :name="item.schedule.lecturer.name"
                              left=""
                              text-class="caption"
                            />
                            <span>{{ item.schedule.lecturer.name }}</span>
                          </v-chip>
                        </template>
                        <template #item="{ item }">
                          <v-list-item-avatar>
                            <app-avatar
                              :image="item.image"
                              :name="item.schedule.lecturer.name"
                              text-class="caption"
                            />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ item.schedule.lecturer.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{
                                item.start_datetime
                                  ? $moment(item.start_datetime).format('llll')
                                  : ''
                              }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </validation-provider>
                  </validation-observer>
                </v-col>
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Student"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="presence.student_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="students"
                        item-value="id"
                        item-text="name"
                        label="Student"
                        name="student_id"
                        required=""
                        clearable=""
                        outlined=""
                      >
                        <template #selection="{ item, selected }">
                          <v-chip :input-value="selected">
                            <app-avatar
                              :image="item.image"
                              :name="item.name"
                              left=""
                              text-class="caption"
                            />
                            <span>{{ item.name }}</span>
                          </v-chip>
                        </template>
                        <template #item="{ item }">
                          <v-list-item-avatar>
                            <app-avatar
                              :image="item.image"
                              :name="item.name"
                              :size="36"
                              text-class="caption"
                            />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ item.name }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </validation-provider>
                  </validation-observer>
                </v-col>
              </v-row>
              <v-row class="flex-wrap">
                <v-col cols="12" sm="6">
                  <div>
                    <input
                      ref="image"
                      class="d-none"
                      type="file"
                      name="image"
                      accept="image/jpeg,image/jpg"
                      @change="onImageSelected"
                    />
                    <v-btn
                      :disabled="isLoading"
                      :loading="isLoading"
                      color="primary"
                      class="ma-1"
                      @click="onSelectImage"
                    >
                      Select Image
                    </v-btn>
                    <span>{{ image.name }}</span>
                  </div>
                  <v-img alt="Image" :src="image.url">
                    <template #placeholder="">
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate=""
                          color="grey lighten-5"
                        />
                      </v-row>
                    </template>
                  </v-img>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              text=""
              @click="onClose"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="primary"
              text=""
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
        @input="onCloseRemoving"
      >
        <v-card>
          <v-app-bar color="primary" dark="" flat="">
            <v-toolbar-title>
              <h3 class="title">
                Delete Confirmation
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onCloseRemoving">
              <v-icon>close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text class="pt-5">
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
              text=""
              @click="onCloseRemoving"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="error"
              text=""
              @click="onRemove(presence)"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isEnlargingImage" width="700" scrollable="">
        <v-card>
          <v-app-bar color="primary" dark="" flat="">
            <v-toolbar-title>
              <h3 class="title">
                Image
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="isEnlargingImage = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text class="pt-5">
            <v-container class="pa-0" fluid="">
              <v-row class="flex-wrap">
                <v-col cols="12">
                  <v-img
                    v-if="presence.image"
                    :src="enlargedImage.url"
                    :alt="enlargedImage.name"
                  >
                    <template #placeholder="">
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate=""
                          color="grey lighten-5"
                        />
                      </v-row>
                    </template>
                  </v-img>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              text=""
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
import { validate } from 'vee-validate'
import toFormData from 'json-form-data'
import cloneDeep from 'lodash/fp/cloneDeep'
import upperFirst from 'lodash/fp/upperFirst'
import { fileReader } from '~/utils/file'

export default {
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
        sortDesc: [false],
        page: 1,
        itemsPerPage: 25,
        sortBy: ['-datetime']
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
      return (status) => {
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
      return (status) => {
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
      return (string) => {
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
      handler({ sortDesc, page, itemsPerPage, sortBy }) {
        this.fetchPresences({
          orderBy: sortBy,
          limit: itemsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * itemsPerPage,
          sortDesc
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
    'image.file'(file) {
      this.presence.image = file
    }
  },
  methods: {
    async fetchPresences(
      {
        orderBy = this.pagination.sortBy,
        limit = this.pagination.itemsPerPage, // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset = (this.pagination.page - 1) * this.pagination.itemsPerPage,
        sortDesc = this.pagination.sortDesc
      } = {
        orderBy: this.pagination.sortBy,
        limit: this.pagination.itemsPerPage,
        // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset: (this.pagination.page - 1) * this.pagination.itemsPerPage,
        sortDesc: this.pagination.sortDesc
      }
    ) {
      try {
        this.isLoading = true
        orderBy = orderBy[0]
        if (orderBy) {
          if (orderBy.includes('.name')) {
            orderBy = `${orderBy.replace('.name', '')}_id`
          }
        }
        if (sortDesc[0]) {
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
        const valids = await Promise.all(
          Object.keys(this.presence)
            .filter((i) => i !== 'id')
            .map((i) => validate(this.presence[i], 'required'))
        )
        if (valids.every(({ valid }) => valid)) {
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
  },
  head() {
    return {
      title: 'Presences'
    }
  }
}
</script>
