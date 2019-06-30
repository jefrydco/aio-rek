<template>
  <v-layout row="" wrap="">
    <v-flex xs12="">
      <v-layout row="" wrap="">
        <v-flex xs12="" md6="">
          <v-card>
            <v-toolbar card="">
              <v-toolbar-title>
                <h2 class="headline">Camera</h2>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-container class="pa-0" fluid="" grid-list-xl="">
                <v-layout style="display: none" row="" wrap="">
                  <v-flex xs12="">
                    <video
                      id="live-video"
                      ref="liveVideo"
                      width="720"
                      height="540"
                      autoplay=""
                    />
                  </v-flex>
                </v-layout>
                <v-layout row="" wrap="">
                  <v-flex xs12="">
                    <canvas
                      id="live-canvas"
                      ref="liveCanvas"
                      width="720"
                      height="540"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row="" wrap="">
                  <v-flex xs12="">
                    <v-select
                      v-model="selectedCamera"
                      :items="cameras"
                      label="Camera"
                      outline=""
                      item-value="deviceId"
                      item-text="label"
                    />
                    <v-chip label="" color="accent" text-color="white">
                      Real FPS: {{ realFps }}
                    </v-chip>
                    <v-chip label="" color="accent" text-color="white">
                      Duration: {{ prettyDuration }}
                    </v-chip>
                  </v-flex>
                </v-layout>

                <v-layout row="" wrap="">
                  <v-flex xs12="" class="pa-4">
                    <v-slider
                      v-model="minConfidence"
                      :max="0.99"
                      :min="0"
                      :step="0.01"
                      label="Min Confidence"
                      thumb-label="always"
                      ticks=""
                    />
                    <v-slider
                      v-model="fps"
                      :max="60"
                      :min="1"
                      :step="1"
                      label="FPS"
                      thumb-label="always"
                      ticks=""
                    />
                    <v-item-group v-model="selectedOptions" multiple="">
                      <v-layout row="" wrap="">
                        <v-flex
                          v-for="(option, i) in options"
                          :key="`option_${i}`"
                          xs12=""
                          md4=""
                          lg3=""
                        >
                          <v-item :value="option.value">
                            <template #default="{ active, toggle }">
                              <v-card
                                :color="active ? 'primary' : ''"
                                dark=""
                                ripple=""
                                @click="toggle"
                              >
                                <v-card-text class="text-xs-center">
                                  <v-icon>{{ option.icon }}</v-icon>
                                  <h3 class="subheading">
                                    {{ option.text }}
                                  </h3>
                                </v-card-text>
                              </v-card>
                            </template>
                          </v-item>
                        </v-flex>
                      </v-layout>
                    </v-item-group>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12="" md6="">
          <v-card class="mb-3">
            <v-toolbar card="">
              <v-toolbar-title>
                <h2 class="headline">
                  Start Lesson
                </h2>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-container class="pa-0" fluid="" grid-list-xl="">
                <v-layout v-if="isLecturerDetected" row="" wrap="">
                  <v-flex xs12="">
                    <v-layout row="" wrap="">
                      <v-flex xs12="" sm3="">
                        <app-avatar
                          :name="removeTitle(detectedLecturer.name)"
                          :image="detectedLecturer.image"
                          :size="128"
                          text-class="caption"
                        />
                      </v-flex>
                      <v-flex xs12="" sm9="">
                        <v-layout row="" wrap="">
                          <v-flex xs12="">
                            <h3 class="display-1">
                              {{ detectedLecturer.name }}
                            </h3>
                          </v-flex>
                        </v-layout>
                        <v-layout v-if="!isAttendanceStarted" row="" wrap="">
                          <v-flex xs12="">
                            <v-dialog v-model="isConfirming" width="350">
                              <template #activator="{ on }">
                                <v-btn large="" v-on="on">Cancel</v-btn>
                              </template>
                              <v-card>
                                <v-card-text>
                                  <div class="body-2">
                                    To cancel the lesson, please keep your face
                                    away from the camera
                                  </div>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer />
                                  <v-btn
                                    :loading="isLoading"
                                    :disabled="isLoading"
                                    flat=""
                                    @click="isConfirming = false"
                                  >
                                    Cancel
                                  </v-btn>
                                  <v-btn
                                    :loading="isLoading"
                                    :disabled="isLoading"
                                    color="primary"
                                    flat=""
                                    @click="onUnderstand"
                                  >
                                    I Understand
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>

                            <v-btn large="" color="primary" @click="onCustom">
                              Custom
                            </v-btn>
                            <v-dialog
                              v-model="isChoosingSchedule"
                              width="1050"
                              scrollable=""
                            >
                              <template #activator="{ on }">
                                <v-btn large="" color="accent" v-on="on">
                                  Start
                                </v-btn>
                              </template>
                              <v-card>
                                <v-toolbar card="" color="primary" dark="">
                                  <v-toolbar-title>
                                    Choose Schedule
                                  </v-toolbar-title>
                                  <v-spacer />
                                  <v-btn
                                    icon=""
                                    @click="isChoosingSchedule = false"
                                  >
                                    <v-icon>close</v-icon>
                                  </v-btn>
                                </v-toolbar>
                                <v-card-text>
                                  <v-container
                                    class="pa-0"
                                    fluid=""
                                    grid-list-xl=""
                                  >
                                    <v-data-iterator
                                      :items="schedules"
                                      :rows-per-page-items="rowsPerPageItems"
                                      :pagination.sync="pagination"
                                      :total-items="totalItems"
                                      :loading="isLoading"
                                      content-tag="v-layout"
                                      row=""
                                      wrap=""
                                    >
                                      <template #item="{ item }">
                                        <v-fade-transition>
                                          <v-flex xs12="" sm6="" md4="">
                                            <v-card
                                              ripple=""
                                              @click="onStart(item)"
                                            >
                                              <v-card-text>
                                                <h4>Subject</h4>
                                                <h5 class="subheading mb-1">
                                                  {{ item.subject.name }}
                                                </h5>

                                                <h4>Grade</h4>
                                                <h5 class="subheading mb-1">
                                                  {{ item.grade }}
                                                </h5>

                                                <h4>Study Program</h4>
                                                <h5 class="subheading mb-1">
                                                  {{ item.study_program.name }}
                                                </h5>

                                                <h4>Major</h4>
                                                <h5 class="subheading mb-1">
                                                  {{ item.major.name }}
                                                </h5>

                                                <h4>Group</h4>
                                                <h5 class="subheading mb-1">
                                                  {{ item.group.name }}
                                                </h5>
                                              </v-card-text>
                                            </v-card>
                                          </v-flex>
                                        </v-fade-transition>
                                      </template>
                                    </v-data-iterator>
                                  </v-container>
                                </v-card-text>
                                <v-divider />
                                <v-card-actions>
                                  <v-spacer />
                                  <v-btn
                                    large=""
                                    flat=""
                                    @click="isChoosingSchedule = false"
                                  >
                                    Cancel
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </v-flex>
                        </v-layout>
                        <v-layout v-else="" row="" wrap="">
                          <v-flex xs12="">
                            <v-layout row="" wrap="">
                              <v-flex xs12="">
                                <h4>Subject</h4>
                                <h5 class="subheading mb-1">
                                  {{ attendance.schedule.subject.name }}
                                </h5>

                                <h4>Grade</h4>
                                <h5 class="subheading mb-1">
                                  {{ attendance.schedule.grade }}
                                </h5>

                                <h4>Study Program</h4>
                                <h5 class="subheading mb-1">
                                  {{ attendance.schedule.study_program.name }}
                                </h5>

                                <h4>Major</h4>
                                <h5 class="subheading mb-1">
                                  {{ attendance.schedule.major.name }}
                                </h5>

                                <h4>Group</h4>
                                <h5 class="subheading mb-1">
                                  {{ attendance.schedule.group.name }}
                                </h5>
                              </v-flex>
                            </v-layout>
                            <v-layout row="" wrap="">
                              <v-flex xs12="">
                                <v-dialog v-model="isStoping" width="350">
                                  <template #activator="{ on }">
                                    <v-btn color="accent" large="" v-on="on">
                                      Stop
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <v-card-text>
                                      <div class="body-2">
                                        Are you sure to stop the lesson?
                                      </div>
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer />
                                      <v-btn
                                        :loading="isLoading"
                                        :disabled="isLoading"
                                        flat=""
                                        @click="isConfirming = false"
                                      >
                                        Cancel
                                      </v-btn>
                                      <v-btn
                                        :loading="isLoading"
                                        :disabled="isLoading"
                                        color="error"
                                        flat=""
                                        @click="onStop"
                                      >
                                        Stop
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-layout v-else="" row="" wrap="">
                  <v-flex xs12="" class="text-xs-center">
                    <h3 class="headline">
                      Point Your face at the camera to start the lesson
                    </h3>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
          <v-card>
            <v-toolbar card="">
              <v-toolbar-title>
                <h2 class="headline">Presences</h2>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-container class="pa-0" fluid="" grid-list-xl="">
                <v-layout row="" wrap="">
                  <v-flex xs12="">
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
                          <td class="py-1 body-2 text-xs-center">
                            <v-chip
                              v-if="item.is_late"
                              color="error"
                              text-color="white"
                            >
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
                            <v-chip
                              :color="getStatusColor(item.status)"
                              text-color="white"
                            >
                              <v-avatar
                                :class="
                                  `${getStatusColor(item.status)} darken-3`
                                "
                              >
                                <v-icon>{{
                                  getStatusIcon(item.status)
                                }}</v-icon>
                              </v-avatar>
                              <span>{{ upperFirst(item.status) }}</span>
                            </v-chip>
                          </td>
                          <td class="py-1 body-2">
                            {{
                              item.datetime
                                ? $moment(item.datetime).format('llll')
                                : ''
                            }}
                          </td>
                          <td class="py-1 body-2">
                            <v-btn
                              color="info"
                              @click="onTriggerEnlargeImage($event, item)"
                            >
                              Enlarge Image
                            </v-btn>
                            <v-btn
                              color="primary"
                              @click="onTrigger($event, item)"
                            >
                              Edit
                            </v-btn>
                            <v-btn
                              color="error"
                              @click="onTriggerRemoving(item)"
                            >
                              Delete
                            </v-btn>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-dialog v-model="isConfiguring" scrollable="" persistent="" width="350">
        <v-card>
          <v-toolbar color="primary" dark="" card="">
            <v-toolbar-title>
              <h3 class="title">
                Device Configuration
              </h3>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container class="pa-0" fluid="" grid-list-xl="">
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <v-autocomplete
                    v-model="selectedRoom"
                    v-validate="'required'"
                    :error-messages="errors.collect('room')"
                    :disabled="isLoading"
                    :items="rooms"
                    item-text="name"
                    item-value="id"
                    label="Room"
                    data-vv-name="room"
                    data-vv-as="room"
                    name="room"
                    required=""
                    clearable=""
                    outline=""
                    data-vv-value-path="room"
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <v-select
                    v-model="selectedDevice"
                    v-validate="'required'"
                    :error-messages="errors.collect('camera')"
                    :disabled="isLoading"
                    :items="cameras"
                    item-value="deviceId"
                    item-text="label"
                    label="Camera"
                    data-vv-name="camera"
                    data-vv-as="camera"
                    name="camera"
                    required=""
                    clearable=""
                    outline=""
                    data-vv-value-path="camera"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" @click="onSaveConfiguration">Save</v-btn>
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
                  <v-img :src="enlargedImage.url" :alt="enlargedImage.name">
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
    </v-flex>
  </v-layout>
</template>

<script>
/* eslint-disable camelcase */

import { HTTPError } from 'ky-universal'
import { Howl } from 'howler'
import toFormData from 'json-form-data'
import prettyMs from 'pretty-ms'
import cloneDeep from 'lodash/fp/cloneDeep'
import upperFirst from 'lodash/fp/upperFirst'
import { mapState, mapActions, mapGetters } from 'vuex'

import {
  setIntervalAsync,
  clearIntervalAsync
} from 'set-interval-async/dynamic'
import { getImageFromCanvas, drawImage } from '~/utils/canvas'

import { types as faceTypes } from '~/store/face'
import { types as detectionTypes } from '~/store/detection'
import { types as cameraTypes } from '~/store/camera'
import { types as deviceTypes } from '~/store/device'

import string from '~/mixins/string'

export default {
  mixins: [string],
  data() {
    return {
      isChoosingSchedule: false,
      isConfirming: false,
      isStoping: false,
      isEnlargingImageDialog: false,
      isLoading: false,
      interval: null,
      selectedDevice: null,
      selectedRoom: null,
      lecturers: [],
      students: [],
      schedules: [],
      rooms: [],
      presences: [],
      headers: [
        { text: 'Image', value: 'image', sortable: false },
        { text: 'Name', value: 'student.name', sortable: false },
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
      fps: 60,
      realFps: 0,
      duration: 0,
      options: [
        {
          text: 'Detection',
          value: 'detection',
          icon: 'check_box_outline_blank'
        },
        { text: 'Landmarks', value: 'landmarks', icon: 'face' },
        { text: 'Recognition', value: 'recognition', icon: 'how_to_reg' },
        { text: 'Expression', value: 'expression', icon: 'insert_emoticon' },
        { text: 'Age & Gender', value: 'agegender', icon: 'cake' }
      ],
      selectedOptions: [
        'detection',
        'landmarks',
        'recognition',
        'expression',
        'agegender'
      ],
      isDrawing: true,
      onTimeSound: null,
      onLateSound: null,
      enlargedImage: {
        name: '',
        url: ''
      }
    }
  },
  computed: {
    ...mapState('face', ['isLoaded']),
    ...mapState('user', ['user']),
    ...mapState('camera', ['cameras']),
    ...mapState('detection', ['detectedLecturer']),
    ...mapState('device', ['device', 'room']),
    ...mapGetters('device', ['isConfigured']),
    ...mapGetters('detection', ['isAttendanceStarted', 'isLecturerDetected']),
    minConfidence: {
      get() {
        return this.$store.state.face.minConfidence
      },
      set(minConfidence) {
        this.$store.commit(
          `face/${faceTypes.SET_MIN_CONFIDENCE}`,
          minConfidence
        )
      }
    },
    attendance: {
      get() {
        return this.$store.state.detection.attendance
      },
      set(attendance) {
        this.$store.commit(
          `detection/${detectionTypes.SET_ATTENDANCE}`,
          attendance
        )
      }
    },
    isConfiguring: {
      get() {
        return this.$store.state.device.isConfiguring
      },
      set(isConfiguring) {
        this.$store.commit(
          `device/${deviceTypes.SET_CONFIGURING}`,
          isConfiguring
        )
      }
    },
    prettyDuration() {
      return prettyMs(this.duration, { separateMilliseconds: true })
    },
    selectedCamera: {
      get() {
        return this.$store.state.camera.selectedCamera
      },
      set(selectedCamera) {
        this.$store.commit(
          `camera/${cameraTypes.SET_SELECTED_CAMERA}`,
          selectedCamera
        )
      }
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
        if (this.isAttendanceStarted) {
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
        }
      },
      deep: true
    },
    selectedCamera(selectedCamera) {
      if (selectedCamera) {
        this.$store.commit(`device/${deviceTypes.SET_DEVICE}`, selectedCamera)
        this.initCamera(selectedCamera)
      }
    },
    minConfidence(minConfidence) {
      this.init()
    },
    fps(fps) {
      this.init()
    },
    isConfigured(isConfigured) {
      if (this.isConfigured) {
        this.isConfiguring = false
      }
    },
    device: {
      handler(device) {
        if (device) {
          this.selectedCamera = device
          this.selectedDevice = device
        }
      },
      immediate: true
    },
    room: {
      handler(room) {
        if (room) {
          this.selectedRoom = room
        }
      },
      immediate: true
    },
    async isAttendanceStarted(isAttendanceStarted) {
      if (isAttendanceStarted) {
        await this.fetchStudents()
        const attendanceId = localStorage.getItem('attendance')
        if (!attendanceId) {
          await Promise.all(
            this.students.map(({ id }) =>
              this.$api.presences.create({
                presence: {
                  student_id: id,
                  attendance_id: this.attendance.id
                }
              })
            )
          )
        }
        await this.fetchPresences()
        await this.initFaceMatcher()
        await this.init()
      } else {
        await this.init()
      }
    }
  },
  async asyncData({ app: { $api, $handleError } }) {
    try {
      const [{ rooms }, { lecturers }] = await Promise.all([
        $api.rooms.fetchPage({ limit: -1 }),
        $api.lecturers.fetchPage({
          limit: -1,
          withRelated: 'images.descriptor'
        })
      ])
      return {
        rooms,
        lecturers
      }
    } catch (error) {
      $handleError(error)
    }
  },
  async beforeMount() {
    await this.getModels()
    await this.initFaceMatcher()
    await this.initData()
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    ...mapActions('camera', ['startCamera', 'stopCamera', 'getCameras']),
    ...mapActions('face', [
      'getModels',
      'getFaceMatcher',
      'getFaceDetections',
      'getBestMatch',
      'drawBestMatch'
    ]),
    async init() {
      await this.initDevice()
      await this.initSound()
      await this.getCameras()
      await this.initCamera(this.selectedCamera)
    },
    async initData(attendanceId = localStorage.getItem('attendance')) {
      if (attendanceId) {
        console.log('attendanceId', attendanceId)
        try {
          this.isLoading = true
          const { attendance } = await this.$api.attendances.fetch(
            attendanceId,
            {
              withRelated:
                'room,schedule.study_program,schedule.major.department,schedule.group,schedule.room,schedule.subject,schedule.lecturer'
            }
          )
          await this.$store.commit(
            `detection/${detectionTypes.SET_ATTENDANCE}`,
            attendance
          )
          await this.$store.commit(
            `detection/${detectionTypes.SET_DETECTED_LECTURER}`,
            attendance.schedule.lecturer
          )
          await this.fetchPresences()
        } catch (error) {
          if (error instanceof HTTPError) {
            const body = await error.response.json()
            if (body && body.errors.error.output.statusCode === 404) {
              localStorage.removeItem('attendance')
            }
          }
        } finally {
          this.isLoading = false
        }
      }
    },
    initSound() {
      this.onTimeSound = new Howl({
        src: '/sounds/on-time.mp3'
      })
      this.onLateSound = new Howl({
        src: '/sounds/on-late.mp3'
      })
    },
    initDevice() {
      if (this.isConfigured) {
        return
      }
      this.isConfiguring = true
    },
    async onSaveConfiguration() {
      const valid = await this.$validator.validate()
      if (valid) {
        this.$store.commit(`device/${deviceTypes.SET_CONFIGURING}`, false)
        this.$store.commit(
          `device/${deviceTypes.SET_DEVICE}`,
          this.selectedDevice
        )
        this.$store.commit(`device/${deviceTypes.SET_ROOM}`, this.selectedRoom)
        this.init()
      }
    },
    async initCamera(deviceId) {
      try {
        const videoStream = await this.startCamera(deviceId)
        const videoEl = this.$refs.liveVideo
        const canvasEl = this.$refs.liveCanvas
        const canvasCtx = canvasEl.getContext('2d')
        videoEl.srcObject = videoStream
        this.onResetPhoto()
        await this.initFaceDetection({
          videoEl,
          canvasEl,
          canvasCtx
        })
      } catch (error) {
        this.$handleError(error)
      }
    },
    onResetPhoto() {
      const canvas = this.$refs.liveCanvas
      const canvasCtx = canvas.getContext('2d')
      canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height)
      canvasCtx.beginPath()
    },
    initFaceMatcher() {
      if (!this.isAttendanceStarted) {
        this.getFaceMatcher({ datasets: this.lecturers })
      } else {
        this.getFaceMatcher({ datasets: this.presences })
      }
    },
    async initFaceDetection({ videoEl, canvasEl, canvasCtx, datasets }) {
      if (this.interval) {
        await clearIntervalAsync(this.interval)
      }
      this.interval = setIntervalAsync(async () => {
        try {
          const t0 = performance.now()
          drawImage(canvasCtx, videoEl, 0, 0, 720, 514, { isFlip: true })
          const options = {
            isDetectionEnabled: this.selectedOptions.includes('detection'),
            isLandmarksEnabled: this.selectedOptions.includes('landmarks'),
            isRecognitionEnabled: this.selectedOptions.includes('recognition'),
            isExpressionEnabled: this.selectedOptions.includes('expression'),
            isAgeGenderEnabled: this.selectedOptions.includes('agegender')
          }
          if (this.isLoaded) {
            if (!this.isAttendanceStarted) {
              const detection = await this.getFaceDetections({
                canvasEl,
                options
              })
              console.log('LECTURER: DETECTION', detection)
              if (detection) {
                detection.recognition = await this.getBestMatch({
                  descriptor: detection.descriptor,
                  options
                })
                if (detection.recognition) {
                  console.log('LECTURER: RECOGNITION', detection.recognition)
                  detection.detected = this.lecturers.find(
                    ({ id }) => id === detection.recognition.label
                  )
                  if (detection.detected) {
                    console.log('LECTURER: DETECTED', detection.detected)
                    await this.drawBestMatch({
                      canvasEl,
                      canvasCtx,
                      detection,
                      options
                    })
                    await (() => {
                      this.$store.commit(
                        `detection/${detectionTypes.SET_DETECTED_LECTURER}`,
                        detection.detected
                      )
                      this.onTimeSound.play()
                      this.clearFaceDetection()
                      this.fetchSchedules({
                        lecturer_id: detection.detected.id
                      })
                    })()
                  }
                }
                const t1 = performance.now()
                const diff = t1 - t0
                this.duration = parseFloat(diff)
                this.realFps = (1000 / diff).toFixed(2)
              }
            } else {
              let detections = await this.getFaceDetections({
                canvasEl,
                options: {
                  ...options,
                  isSingleFace: false
                }
              })
              await console.log('STUDENT: DETECTION', detections)
              if (detections.length > 0) {
                detections = await Promise.all(
                  detections.map(async _detection => {
                    const recognition = await this.getBestMatch({
                      descriptor: _detection.descriptor,
                      options
                    })
                    if (recognition) {
                      console.log('STUDENT: RECOGNITION', recognition)
                      let detection = {
                        ..._detection,
                        recognition
                      }
                      const detected = await this.presences.find(
                        ({ id, status }) =>
                          id === recognition.label && status === 'alpha'
                      )
                      if (detected) {
                        console.log('STUDENT: DETECTED', detected)
                        detection = {
                          ...detection,
                          detected
                        }
                        await this.drawBestMatch({
                          canvasEl,
                          canvasCtx,
                          detection,
                          options
                        })
                        // If the difference between current time and attendance datetime is greater than 1 minutes, then it should be late
                        const is_late =
                          this.$moment().diff(
                            this.$moment(this.attendance.start_datetime)
                          ) >
                          30 * 1000
                        const canvas = this.$refs.liveCanvas
                        const image = await getImageFromCanvas(canvas)
                        const payload = toFormData({
                          image,
                          status: 'present',
                          is_late
                        })
                        await this.$api.presences.update(detected.id, payload, {
                          student_id: detected.student_id
                        })
                        await this.fetchPresences()
                        if (!is_late) {
                          await this.onTimeSound.play()
                        } else {
                          await this.onLateSound.play()
                        }
                      }
                      return detection
                    }
                    return _detection
                  })
                )
                await console.log('STUDENT: RECOGNITION', detections)
                const t1 = performance.now()
                const diff = t1 - t0
                this.duration = parseFloat(diff)
                this.realFps = (1000 / diff).toFixed(2)
              }
              if (this.isAttendanceStarted) {
                const add = this.$moment(this.attendance.start_datetime).add(
                  1,
                  'm'
                )
                const isTimeout = add.isBefore()
                console.log(
                  'STUDENT: IS TIME OUT',
                  add.toISOString(),
                  isTimeout
                )
                if (isTimeout) {
                  await this.onStop()
                }
              }
            }
          }
        } catch (error) {
          console.error(error)
        }
      }, 1000 / this.fps)
    },
    async clearFaceDetection() {
      await clearIntervalAsync(this.interval)
    },
    onUnderstand() {
      this.isConfirming = false
      this.init()
    },
    onCustom() {},
    onTriggerStart() {
      this.isChoosingSchedule = true
    },
    async onStart(schedule) {
      try {
        this.isLoading = true
        const canvas = this.$refs.liveCanvas
        const image = await getImageFromCanvas(canvas)

        const payload = toFormData({
          schedule_id: schedule.id,
          room_id: this.room,
          is_active: true,
          image
        })
        const { attendance } = await this.$api.attendances.create(payload, {
          lecturer_id: this.detectedLecturer.id
        })
        await this.initData(attendance.id)
        await localStorage.setItem('attendance', this.attendance.id)
        await (() => {
          this.isChoosingSchedule = false
          this.$notify({
            kind: 'info',
            message: `${schedule.subject.name} is started`
          })
        })()
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async onStop() {
      try {
        this.isLoading = true
        const payload = {
          attendance: {
            end_datetime: new Date().toISOString()
          }
        }
        await this.$api.attendances.update(this.attendance.id, payload)
        await (() => {
          this.presences = []
          this.$store.commit(`detection/${detectionTypes.RESET_DETECTION}`)
          this.isStoping = false
          localStorage.removeItem('attendance')
        })()
        await this.initFaceMatcher()
        await this.init()
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    onTriggerEnlargeImage(event, item) {
      this.isEnlargingImageDialog = true
      this.enlargedImage.name = item.student.name
      this.enlargedImage.url = item.image
    },
    async fetchPresences(
      {
        orderBy = this.pagination.sortBy,
        limit = this.pagination.rowsPerPage, // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset = (this.pagination.page - 1) * this.pagination.rowsPerPage,
        descending = this.pagination.descending,
        attendance_id = this.attendance.id
      } = {
        orderBy: this.pagination.sortBy,
        limit: this.pagination.rowsPerPage,
        // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        descending: this.pagination.descending,
        attendance_id: this.attendance.id
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
          presences: _presences,
          ...filter
        } = await this.$api.presences.fetchPage({
          orderBy,
          limit,
          offset,
          attendance_id,
          withRelated:
            'student.images.descriptor,attendance.schedule.major,attendance.schedule.lecturer,attendance.room'
        })
        const presences = _presences.map(_presence => {
          const images = cloneDeep(_presence.student.images)
          const name = _presence.student.name
          delete _presence.student.images
          return {
            ..._presence,
            images,
            name
          }
        })
        this.filter = filter
        this.totalItems = rowCount
        this.presences = presences
        console.log('PRESENCES', presences)
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchRooms() {
      try {
        this.isLoading = true
        const { rooms } = await this.$api.rooms.fetchPage({
          limit: -1
        })
        this.rooms = rooms
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchStudents() {
      try {
        this.isLoading = true
        const { students } = await this.$api.students.fetchPage({
          orderBy: 'identifier',
          study_program_id: this.attendance.schedule.study_program_id,
          major_id: this.attendance.schedule.major_id,
          group_id: this.attendance.schedule.group_id,
          limit: -1
        })
        this.students = students
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchLecturers() {
      try {
        this.isLoading = true
        const { lecturers } = await this.$api.lecturers.fetchPage({
          limit: -1
        })
        this.lecturers = lecturers
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    // eslint-disable-next-line
    async fetchSchedules({ lecturer_id, room_id = this.room }) {
      try {
        this.isLoading = true
        const { schedules } = await this.$api.schedules.fetchPage({
          withRelated: 'subject,lecturer,room,study_program,major,group',
          lecturer_id,
          room_id,
          limit: -1
        })
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
          limit: -1,
          study_program_id,
          department_id
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
        const { groups } = await this.$api.groups.fetchPage({
          limit: -1
        })
        this.groups = groups
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
