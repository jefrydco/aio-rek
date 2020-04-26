<template>
  <v-card>
    <v-app-bar flat="">
      <v-toolbar-title>
        <h2 class="headline">Schedules</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="aio-refresh ma-1" color="accent" @click="fetchSchedules">
        Refresh
      </v-btn>
      <v-btn class="aio-create ma-1" color="primary" @click="onTrigger">
        Create Schedule
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="schedules"
        :footer-props="{
          'items-per-page-options': rowsPerPageItems
        }"
        :options.sync="pagination"
        :server-items-length="totalItems"
        :loading="isLoading"
      >
        <template #item="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1 body-2">
              {{ getDay(item.day) }}
            </td>
            <td class="py-1 body-2">
              {{ item.subject ? item.subject.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.lecturer ? item.lecturer.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.room ? item.room.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.grade }}
            </td>
            <td class="py-1 body-2">
              {{ item.study_program ? item.study_program.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.major ? item.major.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.group ? item.group.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.start_time }}
            </td>
            <td class="py-1 body-2">
              {{ item.end_time }}
            </td>
            <td class="py-1 body-2 text-center">
              <v-btn
                :class="`aio-edit-${kebabCase(item.subject.name)}-${kebabCase(
                  item.room.name
                )}-${kebabCase(item.start_time)}`"
                color="primary"
                class="ma-1"
                @click="onTrigger($event, item)"
              >
                Edit
              </v-btn>
              <v-btn
                :class="`aio-delete-${kebabCase(item.subject.name)}-${kebabCase(
                  item.room.name
                )}-${kebabCase(item.start_time)}`"
                color="error"
                class="ma-1"
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
                {{ isEditing ? 'Edit' : 'Create' }} Schedule
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onClose">
              <v-icon>close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text class="pt-5">
            <v-container fluid="">
              <v-row class="flex-wrap">
                <v-col cols="12" sm="6">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Day"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="schedule.day"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="days"
                        label="Day"
                        name="day"
                        required=""
                        clearable=""
                        outlined=""
                        autofocus=""
                      />
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
                        v-model="schedule.room_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="rooms"
                        item-text="name"
                        item-value="id"
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
                      name="Subject"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="schedule.subject_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="subjects"
                        item-text="name"
                        item-value="id"
                        label="Subject"
                        name="subject_id"
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
                      name="Lecturer"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="schedule.lecturer_id"
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
                      name="Start Time"
                      rules="required"
                    >
                      <v-text-field
                        v-model="schedule.start_time"
                        v-mask="'##:##:##'"
                        :error-messages="errors"
                        :disabled="isLoading"
                        label="Start Time"
                        name="start_time"
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
                      name="End Time"
                      rules="required"
                    >
                      <v-text-field
                        v-model="schedule.end_time"
                        v-mask="'##:##:##'"
                        :error-messages="errors"
                        :disabled="isLoading"
                        label="End Time"
                        name="end_time"
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
                      name="Study Program"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="schedule.study_program_id"
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
                        v-model="selectedDepartment"
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
                        v-model="schedule.major_id"
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
                        v-model="schedule.group_id"
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
                        v-model="schedule.grade"
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
              class="aio-cancel-edit-save"
              @click="onClose"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="primary"
              text=""
              class="aio-edit-save"
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
              Are you sure you want to remove {{ schedule.subject.name }}?
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              text=""
              class="aio-cancel-delete"
              @click="onCloseRemoving"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="error"
              text=""
              class="aio-remove"
              @click="onRemove(schedule)"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import { validate } from 'vee-validate'
import cloneDeep from 'lodash/fp/cloneDeep'
import string from '~/mixins/string'

export default {
  mixins: [string],
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const [
        { rowCount, schedules, ...filter },
        { studyPrograms },
        { departments },
        { groups },
        { rooms },
        { subjects },
        { lecturers }
      ] = await Promise.all([
        $api.schedules.fetchPage({
          orderBy: 'day',
          limit: 25,
          offset: 0,
          withRelated:
            'study_program,major.department,group,room,subject,lecturer'
        }),
        $api.studyPrograms.fetchPage({ limit: -1 }),
        $api.departments.fetchPage({ limit: -1 }),
        $api.groups.fetchPage({ limit: -1 }),
        $api.rooms.fetchPage({ limit: -1 }),
        $api.subjects.fetchPage({ limit: -1 }),
        $api.lecturers.fetchPage({ limit: -1 })
      ])

      return {
        filter,
        schedules,
        studyPrograms,
        departments,
        groups,
        rooms,
        subjects,
        lecturers,
        totalItems: rowCount
      }
    } catch ({ response }) {
      $handleError(response)
    }
  },
  data() {
    return {
      isCreatingOrEditingDialog: false,
      isEditing: false,
      isRemovingDialog: false,
      default: {
        id: null,
        day: null,
        start_time: null,
        end_time: null,
        grade: null,
        subject_id: null,
        lecturer_id: null,
        room_id: null,
        major_id: null,
        study_program_id: null,
        group_id: null,
        subject: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null,
          identifier: null
        },
        lecturer: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null,
          identifier: null,
          image: null,
          is_active: true,
          user_id: null
        },
        room: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null,
          in_use: false,
          user_id: null
        },
        study_program: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null
        },
        major: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null,
          study_program_id: null,
          department_id: null,
          department: {
            id: null,
            created_at: null,
            updated_at: null,
            name: null
          }
        },
        group: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null
        }
      },
      schedule: {
        id: null,
        day: null,
        start_time: null,
        end_time: null,
        grade: null,
        subject_id: null,
        lecturer_id: null,
        room_id: null,
        major_id: null,
        study_program_id: null,
        group_id: null,
        subject: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null,
          identifier: null
        },
        lecturer: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null,
          identifier: null,
          image: null,
          is_active: true,
          user_id: null
        },
        room: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null,
          in_use: false,
          user_id: null
        },
        study_program: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null
        },
        major: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null,
          study_program_id: null,
          department_id: null,
          department: {
            id: null,
            created_at: null,
            updated_at: null,
            name: null
          }
        },
        group: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null
        }
      },
      schedules: [],
      filter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: ''
      },
      isLoading: false,
      headers: [
        { text: 'Day', value: 'day' },
        { text: 'Subject', value: 'subject.name' },
        { text: 'Lecturer', value: 'lecturer.name' },
        { text: 'Room', value: 'room.name' },
        { text: 'Grade', value: 'grade' },
        { text: 'Study Program', value: 'study_program.name' },
        { text: 'Major', value: 'major.name' },
        { text: 'Group', value: 'group.name' },
        { text: 'Start Time', value: 'start_time' },
        { text: 'End Time', value: 'end_time' },
        { text: 'Action', align: 'center', sortable: false }
      ],
      rowsPerPageItems: [25, 50, 75, 100],
      pagination: {
        sortDesc: [false],
        page: 1,
        itemsPerPage: 25,
        sortBy: ['day']
      },
      totalItems: 0,
      days: [
        { text: 'Monday', value: 'monday' },
        { text: 'Tuesday', value: 'tuesday' },
        { text: 'Wednesday', value: 'wednesday' },
        { text: 'Thursday', value: 'thursday' },
        { text: 'Friday', value: 'friday' }
      ],
      selectedDepartment: null,
      studyPrograms: [],
      departments: [],
      majors: [],
      groups: [],
      rooms: [],
      subjects: [],
      lecturers: []
    }
  },
  computed: {
    getDay() {
      return (_day) => {
        if (!_day) {
          return ''
        }
        const { text } = this.days.find((day) => day.value === _day)
        if (text) {
          return text
        }
        return ''
      }
    },
    grades() {
      const grades = []
      const studyProgram = this.studyPrograms.find(
        ({ id }) => id === this.schedule.study_program_id
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
      handler({ sortDesc, page, itemsPerPage, sortBy }) {
        this.fetchSchedules({
          orderBy: sortBy,
          limit: itemsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * itemsPerPage,
          sortDesc
        })
      },
      deep: true
    },
    // eslint-disable-next-line
    'schedule.study_program_id': function (study_program_id) {
      // eslint-disable-next-line
      if (study_program_id && this.selectedDepartment) {
        this.fetchMajors({
          study_program_id,
          department_id: this.selectedDepartment
        })
      } else {
        this.majors = []
      }
    },
    selectedDepartment(selectedDepartment) {
      if (this.schedule.study_program_id && selectedDepartment) {
        this.fetchMajors({
          study_program_id: this.schedule.study_program_id,
          department_id: selectedDepartment
        })
      } else {
        this.majors = []
      }
    }
  },
  methods: {
    async fetchSchedules(
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
          schedules,
          ...filter
        } = await this.$api.schedules.fetchPage({
          orderBy,
          limit,
          offset,
          withRelated: 'study_program,major,group,room,subject,lecturer'
        })
        this.filter = filter
        this.totalItems = rowCount
        this.schedules = schedules
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
    onTrigger(event, item) {
      this.isCreatingOrEditingDialog = true
      if (item) {
        this.isEditing = true
        this.schedule = { ...item }
        this.selectedDepartment = item.major.department_id
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.selectedDepartment = null
      this.isEditing = false

      this.schedule = { ...this.default }
    },
    async onCreateOrEdit(
      event,
      { _payload = this.schedule, isEditing = false } = {
        _payload: this.schedule,
        isEditing: false
      }
    ) {
      try {
        const valids = await Promise.all(
          Object.keys(this.schedule)
            .filter((i) => i !== 'id')
            .map((i) => validate(this.schedule[i], 'required'))
        )
        if (valids.every(({ valid }) => valid)) {
          this.isLoading = true

          let payload = cloneDeep(_payload)
          delete payload.id
          delete payload.subject
          delete payload.lecturer
          delete payload.room
          delete payload.study_program
          delete payload.major
          delete payload.group

          payload = {
            schedule: payload
          }

          if (this.isEditing) {
            Object.assign(payload.schedule, {
              updated_at: new Date().toISOString()
            })
            await this.$api.schedules.update(_payload.id, payload)
            this.$notify({
              kind: 'success',
              message: 'Schedule is updated successfully'
            })
          } else {
            await this.$api.schedules.create(payload)
            await this.$notify({
              kind: 'success',
              message: 'Schedule is created successfully'
            })
          }

          await Promise.all([this.onClose(), this.fetchSchedules()])
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
      this.schedule = { ...item }
    },
    onCloseRemoving() {
      this.isRemovingDialog = false

      this.schedule = { ...this.default }
    },
    async onRemove(item) {
      try {
        this.isLoading = true

        await this.$api.schedules.destroy(item.id)
        await Promise.all([
          this.fetchSchedules(),
          this.onCloseRemoving(),
          this.$notify({
            kind: 'success',
            message: 'Schedule is deleted successfully'
          })
        ])
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    }
  },
  head() {
    return {
      title: 'Schedules'
    }
  }
}
</script>
