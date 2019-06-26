<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Attendances</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="onTrigger">
        Create Attendance
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="attendances"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="isLoading"
      >
        <template #items="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1">
              <app-avatar
                :name="item.schedule.subject.name"
                :image="item.image"
                text-class="caption"
              />
            </td>
            <td class="py-1 body-2">{{ item.schedule.subject.name }}</td>
            <td class="py-1 body-2">{{ item.schedule.lecturer.name }}</td>
            <td class="py-1 body-2">{{ item.room.name }}</td>
            <td class="py-1 body-2">{{ item.schedule.grade }}</td>
            <td class="py-1 body-2">{{ item.schedule.study_program.name }}</td>
            <td class="py-1 body-2">{{ item.schedule.major.name }}</td>
            <td class="py-1 body-2">{{ item.schedule.group.name }}</td>
            <td class="py-1 body-2 text-xs-center">
              <v-chip v-if="item.is_active" color="info" text-color="white">
                <v-avatar class="info darken-3">
                  <v-icon>priority_high</v-icon>
                </v-avatar>
                Active
              </v-chip>
              <v-chip v-else="" color="success" text-color="white">
                <v-avatar class="success darken-3">
                  <v-icon>check</v-icon>
                </v-avatar>
                Finished
              </v-chip>
            </td>
            <td class="py-1 body-2">
              {{ $moment(item.start_datetime).format('llll') }}
            </td>
            <td class="py-1 body-2">
              {{
                item.end_datetime
                  ? $moment(item.end_datetime).format('llll')
                  : '-'
              }}
            </td>
            <td class="py-1 body-2 text-xs-center">
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
        @input="onClose"
      >
        <v-card>
          <v-toolbar color="primary" dark="" card="">
            <v-toolbar-title>
              <h3 class="title">
                {{ isEditing ? 'Edit' : 'Create' }} Attendance
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
                  <v-menu
                    ref="startDate"
                    v-model="isStartDate"
                    offset-y=""
                    bottom=""
                    :close-on-content-click="false"
                  >
                    <template #activator="{on}">
                      <v-text-field
                        v-validate="'required'"
                        :value="startDate"
                        :error-messages="errors.collect('start_date')"
                        :disabled="isLoading"
                        label="Start Date"
                        data-vv-name="start_date"
                        data-vv-as="start date"
                        name="start_date"
                        required=""
                        clearable=""
                        outline=""
                        readonly=""
                        data-vv-delay="1000"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker v-model="start.date" scrollable="">
                      <v-spacer />
                      <v-btn flat="" @click="isStartDate = false">Cancel</v-btn>
                      <v-btn
                        flat=""
                        color="primary"
                        @click="$refs.startDate.save(start.date)"
                      >
                        Ok
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12="" sm6="">
                  <v-menu
                    ref="startTime"
                    v-model="isStartTime"
                    offset-y=""
                    bottom=""
                    :close-on-content-click="false"
                  >
                    <template #activator="{on}">
                      <v-text-field
                        v-validate="'required'"
                        :value="startTime"
                        :error-messages="errors.collect('start_time')"
                        :disabled="isLoading"
                        label="Start Time"
                        data-vv-name="start_time"
                        data-vv-as="start time"
                        name="start_time"
                        required=""
                        clearable=""
                        outline=""
                        readonly=""
                        data-vv-delay="1000"
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-model="start.time"
                      scrollable=""
                      :max="end.time"
                    >
                      <v-spacer />
                      <v-btn flat="" @click="isStartTime = false">Cancel</v-btn>
                      <v-btn
                        flat=""
                        color="primary"
                        @click="$refs.startTime.save(start.time)"
                      >
                        Ok
                      </v-btn>
                    </v-time-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <v-menu
                    ref="endDate"
                    v-model="isEndDate"
                    offset-y=""
                    bottom=""
                    :close-on-content-click="false"
                  >
                    <template #activator="{on}">
                      <v-text-field
                        v-validate="'required'"
                        :value="endDate"
                        :error-messages="errors.collect('end_date')"
                        :disabled="isLoading"
                        label="End Date"
                        data-vv-name="end_date"
                        data-vv-as="end date"
                        name="end_date"
                        required=""
                        clearable=""
                        outline=""
                        readonly=""
                        data-vv-delay="1000"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="end.date"
                      scrollable=""
                      :min="start.date"
                    >
                      <v-spacer />
                      <v-btn flat="" @click="isEndDate = false">Cancel</v-btn>
                      <v-btn
                        flat=""
                        color="primary"
                        @click="$refs.endDate.save(end.date)"
                      >
                        Ok
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12="" sm6="">
                  <v-menu
                    ref="endTime"
                    v-model="isEndTime"
                    offset-y=""
                    bottom=""
                    :close-on-content-click="false"
                  >
                    <template #activator="{on}">
                      <v-text-field
                        v-validate="'required'"
                        :value="endTime"
                        :error-messages="errors.collect('end_time')"
                        :disabled="isLoading"
                        label="End Time"
                        data-vv-name="end_time"
                        data-vv-as="end time"
                        name="end_time"
                        required=""
                        clearable=""
                        outline=""
                        readonly=""
                        data-vv-delay="1000"
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-model="end.time"
                      scrollable=""
                      :min="start.time"
                    >
                      <v-spacer />
                      <v-btn flat="" @click="isEndTime = false">Cancel</v-btn>
                      <v-btn
                        flat=""
                        color="primary"
                        @click="$refs.endTime.save(end.time)"
                      >
                        Ok
                      </v-btn>
                    </v-time-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
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
                    v-model="attendance.schedule_id"
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
                    data-vv-value-path="attendance.schedule_id"
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
                            $moment(item.start_time, 'HH:mm:ss').format('HH:mm')
                          }}
                          -
                          {{
                            $moment(item.end_time, 'HH:mm:ss').format('HH:mm')
                          }}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12="" sm6="">
                  <v-autocomplete
                    v-model="attendance.room_id"
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
                    data-vv-value-path="attendance.room_id"
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <v-switch
                    v-model="attendance.is_active"
                    class="ma-0"
                    label="Is attendance active?"
                  />
                </v-flex>
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
              Are you sure you want to remove {{ attendance.name }}?
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
              @click="onRemove(attendance)"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isEnlargingImageDialog" width="700" scrollable="">
        <v-card>
          <v-toolbar color="primary" dark="" card="">
            <v-toolbar-title>
              <h3 class="title">
                Image
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="isEnlargingImageDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-container class="pa-0" fluid="" grid-list-xl="">
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <v-img
                    v-if="attendance.image"
                    :src="attendance.url"
                    :alt="attendance.schedule.subject.name"
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
              @click="isEnlargingImageDialog = false"
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
import { fileReader } from '~/utils/file'

import AppAvatar from '~/components/AppAvatar'

export default {
  components: {
    AppAvatar
  },
  head() {
    return {
      title: 'Attendances'
    }
  },
  data() {
    const datetime = this.$moment()
    return {
      isStartDate: false,
      isStartTime: false,
      isEndDate: false,
      isEndTime: false,
      isEnlargingImageDialog: false,
      isCreatingOrEditingDialog: false,
      isEditing: false,
      isRemovingDialog: false,
      default: {
        id: null,
        is_active: true,
        start_datetime: null,
        end_datetime: null,
        schedule_id: null,
        room_id: null,
        image: null,
        url: null
      },
      attendance: {
        id: null,
        is_active: true,
        start_datetime: null,
        end_datetime: null,
        schedule_id: null,
        room_id: null,
        image: null,
        url: null
      },
      attendances: [],
      filter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: ''
      },
      isLoading: false,
      headers: [
        { text: 'Image', value: 'image', sortable: false },
        { text: 'Subject', value: 'schedule.subject.name' },
        { text: 'Lecturer', value: 'schedule.lecturer.name' },
        { text: 'Room', value: 'schedule.room.name' },
        { text: 'Grade', value: 'schedule.grade' },
        { text: 'Study Program', value: 'schedule.study_program.name' },
        { text: 'Major', value: 'schedule.major.name' },
        { text: 'Group', value: 'schedule.group.name' },
        { text: 'Is Active?', value: 'is_active', align: 'center' },
        { text: 'Start Datetime', value: 'start_time' },
        { text: 'End Datetime', value: 'end_time' },
        { text: 'Action', align: 'center', sortable: false }
      ],
      rowsPerPageItems: [25, 50, 75, 100],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 25,
        sortBy: 'created_at',
        totalItems: 25
      },
      totalItems: 0,
      schedules: [],
      studyPrograms: [],
      departments: [],
      majors: [],
      groups: [],
      lecturers: [],
      rooms: [],
      scheduleFilter: {
        study_program_id: '2bd55595-0bbb-4c3d-b44c-a9349b515c83',
        department_id: 'f015862b-3012-49f1-8086-84e4dc64f6d8',
        major_id: '49bf282d-0aaf-4a94-9e0a-800d544c1748',
        group_id: '17f6f98c-37ec-4d4f-99f6-d0dcc9f3df46',
        grade: '3',
        lecturer_id: 'c860b8a4-1245-43fd-9044-030781ab7879'
      },
      start: {
        date: datetime.format('YYYY-MM-DD'),
        time: datetime.format('HH:mm')
      },
      end: {
        date: datetime.format('YYYY-MM-DD'),
        time: null
      },
      image: {
        name: '',
        url: '',
        file: null
      }
    }
  },
  computed: {
    startDate() {
      return this.start.date
        ? this.$moment(this.start.date, 'YYYY-MM-DD').format('LL')
        : ''
    },
    startTime() {
      return this.start.time
        ? this.$moment(this.start.time, 'HH:mm').format('LT')
        : ''
    },
    endDate() {
      return this.end.date
        ? this.$moment(this.end.date, 'YYYY-MM-DD').format('LL')
        : ''
    },
    endTime() {
      return this.end.time
        ? this.$moment(this.end.time, 'HH:mm').format('LT')
        : ''
    },
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
        this.fetchAttendances({
          orderBy: sortBy,
          limit: rowsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * rowsPerPage
        })
      },
      deep: true
    },
    start: {
      handler({ date, time }) {
        if (date && time) {
          this.attendance.start_datetime = this.$moment(
            `${date} ${time}`
          ).toISOString()
        } else {
          this.attendance.start_datetime = null
        }
      },
      deep: true,
      immediate: true
    },
    end: {
      handler({ date, time }) {
        if (date && time) {
          this.attendance.end_datetime = this.$moment(
            `${date} ${time}`
          ).toISOString()
        } else {
          this.attendance.end_datetime = null
        }
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
      },
      deep: true
    },
    'image.file': async function(file) {
      this.attendance.image = file
      this.attendance.url = await fileReader(file)
    }
  },
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const [
        { rowCount, attendances, ...filter },
        { studyPrograms },
        { departments },
        { groups },
        { rooms },
        { lecturers }
      ] = await Promise.all([
        $api.attendances.fetchPage({
          orderBy: 'created_at',
          limit: 25,
          offset: 0,
          withRelated:
            'room,schedule.study_program,schedule.major.department,schedule.group,schedule.room,schedule.subject,schedule.lecturer'
        }),
        $api.studyPrograms.fetchPage({ limit: -1 }),
        $api.departments.fetchPage({ limit: -1 }),
        $api.groups.fetchPage({ limit: -1 }),
        $api.rooms.fetchPage({ limit: -1 }),
        $api.lecturers.fetchPage({ limit: -1 })
      ])
      return {
        filter,
        attendances,
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
    async fetchAttendances(
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
          attendances,
          ...filter
        } = await this.$api.attendances.fetchPage({
          orderBy,
          limit,
          offset,
          withRelated:
            'room,schedule.study_program,schedule.major.department,schedule.group,schedule.room,schedule.subject,schedule.lecturer'
        })
        this.filter = filter
        this.totalItems = rowCount
        this.attendances = attendances
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
    onTriggerEnlargeImage(event, item) {
      this.isEnlargingImageDialog = true
      this.attendance = { ...item }
    },
    onTrigger(event, item) {
      this.isCreatingOrEditingDialog = true
      if (item) {
        this.isEditing = true
        this.attendance = { ...item }

        this.start.date = this.$moment(item.start_datetime).format('YYYY-MM-DD')
        this.start.time = this.$moment(item.start_datetime).format('HH:mm')

        this.end.date = this.$moment(item.end_datetime).format('YYYY-MM-DD')
        this.end.time = this.$moment(item.end_datetime).format('HH:mm')

        this.image.url = item.image

        Promise.all([
          this.fetchMajors({
            study_program_id: item.schedule.study_program_id,
            department_id: item.schedule.major.department_id
          }),
          this.fetchSchedules({
            lecturer_id: item.schedule.lecturer_id,
            room_id: item.room_id
          })
        ])
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false
      this.$validator.reset()
      this.attendance = { ...this.default }
    },
    async onCreateOrEdit(
      event,
      { _payload = this.attendance, isEditing = false } = {
        _payload: this.attendance,
        isEditing: false
      }
    ) {
      try {
        const valid = await this.$validator.validate()
        if (valid) {
          this.isLoading = true

          let payload = cloneDeep(_payload)

          delete payload.room
          delete payload.schedule
          delete payload.url

          if (this.isEditing) {
            payload = {
              ...payload,
              updated_at: new Date().toISOString()
            }
            if (payload.image instanceof File) {
              payload = toFormData(payload)
            } else {
              payload = {
                attendance: {
                  ...payload
                }
              }
            }
            await this.$api.attendances.update(_payload.id, payload, {
              lecturer_id: this.scheduleFilter.lecturer_id
            })
            this.$notify({
              kind: 'success',
              message: 'Attendance is updated successfully'
            })
          } else {
            payload = toFormData(payload)
            await this.$api.attendances.create(payload, {
              lecturer_id: this.scheduleFilter.lecturer_id
            })
            await this.$notify({
              kind: 'success',
              message: 'Attendance is created successfully'
            })
          }

          await Promise.all([this.onClose(), this.fetchAttendances()])
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
      this.attendance = { ...item }
    },
    onCloseRemoving() {
      this.isRemovingDialog = false
      this.$validator.reset()
      this.attendance = { ...this.default }
    },
    async onRemove(item) {
      try {
        this.isLoading = true

        await this.$api.attendances.destroy(item.id)
        await Promise.all([
          this.fetchAttendances(),
          this.onCloseRemoving(),
          this.$notify({
            kind: 'success',
            message: 'Attendance is deleted successfully'
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
