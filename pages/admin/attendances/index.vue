<template>
  <v-card>
    <v-app-bar flat="">
      <v-toolbar-title>
        <h2 class="headline">Attendances</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="ma-1" color="accent" @click="fetchAttendances">
        Refresh
      </v-btn>
      <v-btn class="ma-1" color="primary" @click="onTrigger">
        Create Attendance
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="attendances"
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
                :name="item.schedule.subject.name"
                :image="item.image"
                text-class="caption"
              />
            </td>
            <td class="py-1 body-2">
              {{ item.schedule ? item.schedule.subject.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.schedule ? item.schedule.lecturer.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.room ? item.room.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.schedule ? item.schedule.grade : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.schedule ? item.schedule.study_program.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.schedule ? item.schedule.major.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.schedule ? item.schedule.group.name : '' }}
            </td>
            <td class="py-1 body-2 text-center">
              <v-chip v-if="item.is_active" color="info" text-color="white">
                <v-avatar left="" class="info darken-3">
                  <v-icon>priority_high</v-icon>
                </v-avatar>
                <span>Active</span>
              </v-chip>
              <v-chip v-else="" color="success" text-color="white">
                <v-avatar left="" class="success darken-3">
                  <v-icon>check</v-icon>
                </v-avatar>
                <span>Finished</span>
              </v-chip>
            </td>
            <td class="py-1 body-2">
              {{
                item.start_datetime
                  ? $moment(item.start_datetime).format('llll')
                  : '-'
              }}
            </td>
            <td class="py-1 body-2">
              {{
                item.end_datetime
                  ? $moment(item.end_datetime).format('llll')
                  : '-'
              }}
            </td>
            <td class="py-1 body-2">
              {{ item.diff_datetime ? prettyMs(item.diff_datetime) : '-' }}
            </td>
            <td class="py-1 body-2 text-center">
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
                {{ isEditing ? 'Edit' : 'Create' }} Attendance
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
                  <v-menu
                    ref="startDate"
                    v-model="isStartDate"
                    offset-y=""
                    bottom=""
                    :close-on-content-click="false"
                  >
                    <template #activator="{on}">
                      <validation-observer>
                        <validation-provider
                          #default="{ errors }"
                          name="Start Date"
                          rules="required"
                        >
                          <v-text-field
                            :value="startDate"
                            :error-messages="errors"
                            :disabled="isLoading"
                            label="Start Date"
                            name="start_date"
                            required=""
                            clearable=""
                            outlined=""
                            readonly=""
                            v-on="on"
                            @click:clear="
                              () => {
                                start.date = null
                              }
                            "
                          />
                        </validation-provider>
                      </validation-observer>
                    </template>
                    <v-date-picker v-model="start.date" scrollable="">
                      <v-spacer />
                      <v-btn text="" @click="isStartDate = false">Cancel</v-btn>
                      <v-btn
                        text=""
                        color="primary"
                        @click="$refs.startDate.save(start.date)"
                      >
                        Ok
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="startTime"
                    v-model="isStartTime"
                    offset-y=""
                    bottom=""
                    :close-on-content-click="false"
                  >
                    <template #activator="{on}">
                      <validation-observer>
                        <validation-provider
                          #default="{ errors }"
                          name="Start Time"
                          rules="required"
                        >
                          <v-text-field
                            :value="startTime"
                            :error-messages="errors"
                            :disabled="isLoading"
                            label="Start Time"
                            name="start_datetime"
                            required=""
                            clearable=""
                            outlined=""
                            readonly=""
                            v-on="on"
                            @click:clear="
                              () => {
                                start.time = null
                              }
                            "
                          />
                        </validation-provider>
                      </validation-observer>
                    </template>
                    <v-time-picker
                      v-model="start.time"
                      scrollable=""
                      :max="end.time"
                    >
                      <v-spacer />
                      <v-btn text="" @click="isStartTime = false">Cancel</v-btn>
                      <v-btn
                        text=""
                        color="primary"
                        @click="$refs.startTime.save(start.time)"
                      >
                        Ok
                      </v-btn>
                    </v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row class="flex-wrap">
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="endDate"
                    v-model="isEndDate"
                    offset-y=""
                    bottom=""
                    :close-on-content-click="false"
                  >
                    <template #activator="{on}">
                      <validation-observer>
                        <validation-provider
                          #default="{ errors }"
                          name="End Date"
                          rules="required"
                        >
                          <v-text-field
                            :value="endDate"
                            :error-messages="errors"
                            :disabled="isLoading"
                            label="End Date"
                            name="end_date"
                            required=""
                            clearable=""
                            outlined=""
                            readonly=""
                            v-on="on"
                            @click:clear="
                              () => {
                                end.date = null
                              }
                            "
                          />
                        </validation-provider>
                      </validation-observer>
                    </template>
                    <v-date-picker
                      v-model="end.date"
                      scrollable=""
                      :min="start.date"
                    >
                      <v-spacer />
                      <v-btn text="" @click="isEndDate = false">Cancel</v-btn>
                      <v-btn
                        text=""
                        color="primary"
                        @click="$refs.endDate.save(end.date)"
                      >
                        Ok
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="endTime"
                    v-model="isEndTime"
                    offset-y=""
                    bottom=""
                    :close-on-content-click="false"
                  >
                    <template #activator="{on}">
                      <v-text-field
                        :value="endTime"
                        :disabled="isLoading"
                        label="End Time"
                        name="end_datetime"
                        clearable=""
                        outlined=""
                        readonly=""
                        v-on="on"
                        @click:clear="
                          () => {
                            end.time = null
                          }
                        "
                      />
                    </template>
                    <v-time-picker
                      v-model="end.time"
                      scrollable=""
                      :min="start.time"
                    >
                      <v-spacer />
                      <v-btn text="" @click="isEndTime = false">Cancel</v-btn>
                      <v-btn
                        text=""
                        color="primary"
                        @click="$refs.endTime.save(end.time)"
                      >
                        Ok
                      </v-btn>
                    </v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
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
                        v-model="attendance.schedule_id"
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
                                $moment(item.start_time, 'HH:mm:ss').format(
                                  'HH:mm'
                                )
                              }}
                              -
                              {{
                                $moment(item.end_time, 'HH:mm:ss').format(
                                  'HH:mm'
                                )
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
                        v-model="attendance.room_id"
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
                  <v-switch
                    v-model="attendance.is_active"
                    class="ma-0"
                    label="Is attendance active?"
                  />
                </v-col>
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
              Are you sure you want to remove {{ attendance.name }}?
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
              @click="onRemove(attendance)"
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
                    v-if="attendance.image"
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
import prettyMs from 'pretty-ms'
import { fileReader } from '~/utils/file'

export default {
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
          orderBy: '-start_datetime',
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
  data() {
    const datetime = this.$moment()
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
        is_active: true,
        start_datetime: null,
        end_datetime: null,
        schedule_id: null,
        room_id: null,
        image: null
      },
      attendance: {
        id: null,
        is_active: true,
        start_datetime: null,
        end_datetime: null,
        schedule_id: null,
        room_id: null,
        image: null
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
        { text: 'Start Datetime', value: 'start_datetime' },
        { text: 'End Datetime', value: 'end_datetime' },
        { text: 'Duration', value: 'diff_datetime' },
        { text: 'Action', align: 'center', sortable: false }
      ],
      rowsPerPageItems: [25, 50, 75, 100],
      pagination: {
        sortDesc: [false],
        page: 1,
        itemsPerPage: 25,
        sortBy: ['-start_datetime']
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
        study_program_id: null,
        department_id: null,
        major_id: null,
        group_id: null,
        grade: null,
        lecturer_id: null
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
      },
      enlargedImage: {
        name: '',
        url: ''
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
    },
    prettyMs() {
      return (ms) => prettyMs(ms)
    }
  },
  watch: {
    pagination: {
      handler({ sortDesc, page, itemsPerPage, sortBy }) {
        this.fetchAttendances({
          orderBy: sortBy,
          limit: itemsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * itemsPerPage
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
    'image.file'(file) {
      this.attendance.image = file
    },
    'end.time'(time) {
      if (time !== null) {
        this.attendance.is_active = false
      } else {
        this.attendance.is_active = true
      }
    }
  },
  methods: {
    async fetchAttendances(
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
    async onTriggerEnlargeImage(event, item) {
      this.isEnlargingImage = true
      this.attendance = { ...item }

      this.enlargedImage.name = item.schedule.subject.name
      if (this.attendance.image instanceof File) {
        this.enlargedImage.url = await fileReader(this.attendance.image)
      } else {
        this.enlargedImage.url = item.image
      }
    },
    async onTrigger(event, item) {
      this.isCreatingOrEditingDialog = true
      if (item) {
        this.isEditing = true
        this.attendance = { ...item }

        if (item.start_datetime) {
          this.start.date = this.$moment(item.start_datetime).format(
            'YYYY-MM-DD'
          )
          this.start.time = this.$moment(item.start_datetime).format('HH:mm')
        }

        if (item.end_datetime) {
          this.end.date = this.$moment(item.end_datetime).format('YYYY-MM-DD')
          this.end.time = this.$moment(item.end_datetime).format('HH:mm')
        }

        this.image.url = item.image

        await this.fetchMajors({
          study_program_id: item.schedule.study_program_id,
          department_id: item.schedule.major.department_id
        })
        await this.fetchSchedules({
          lecturer_id: item.schedule.lecturer_id,
          room_id: item.room_id
        })
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false

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
        const valids = await Promise.all(
          Object.keys(this.attendances)
            .filter((i) => i !== 'id')
            .map((i) => validate(this.attendances[i], 'required'))
        )
        if (valids.every(({ valid }) => valid)) {
          this.isLoading = true

          let payload = cloneDeep(_payload)

          delete payload.room
          delete payload.schedule
          delete payload.diff_datetime

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
            await this.onRemoveImage()
            await this.$notify({
              kind: 'success',
              message: 'Attendance is updated successfully'
            })
          } else {
            payload = toFormData(payload)
            await this.$api.attendances.create(payload, {
              lecturer_id: this.scheduleFilter.lecturer_id
            })
            await this.onRemoveImage()
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
  },
  head() {
    return {
      title: 'Attendances'
    }
  }
}
</script>
