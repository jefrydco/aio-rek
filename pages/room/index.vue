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
                      label="Select Camera"
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
                  <v-flex xs12="">
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
          <v-card>
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
                        <h3 class="display-1 mb-3">
                          {{ detectedLecturer.name }}
                        </h3>
                        <v-dialog v-model="isConfirming" width="350">
                          <template #activator="{ on }">
                            <v-btn large="" v-on="on">Cancel</v-btn>
                          </template>
                          <v-card>
                            <v-card-text>
                              <div class="body-2">
                                To cancel the lesson, please keep your face away
                                from the camera
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
                              <v-toolbar-title>Choose Schedule</v-toolbar-title>
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
                                            <h5 class="subheading">
                                              {{ item.subject.name }}
                                            </h5>

                                            <h4>Grade</h4>
                                            <h5 class="subheading">
                                              {{ item.grade }}
                                            </h5>

                                            <h4>Study Program</h4>
                                            <h5 class="subheading">
                                              {{ item.study_program.name }}
                                            </h5>

                                            <h4>Major</h4>
                                            <h5 class="subheading">
                                              {{ item.major.name }}
                                            </h5>

                                            <h4>Group</h4>
                                            <h5 class="subheading">
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
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { Howl } from 'howler'
import toFormData from 'json-form-data'
import prettyMs from 'pretty-ms'
import { mapState, mapActions } from 'vuex'
import {
  setIntervalAsync,
  clearIntervalAsync
} from 'set-interval-async/dynamic'
import { getImageFromCanvas, drawImage } from '~/utils/canvas'

import { types as detectionTypes } from '~/store/detection'
import { types as cameraTypes } from '~/store/camera'
import string from '~/mixins/string'

import AppAvatar from '~/components/AppAvatar'

export default {
  components: {
    AppAvatar
  },
  mixins: [string],
  data() {
    return {
      isChoosingSchedule: false,
      isConfirming: false,
      isLoading: false,
      interval: null,
      lecturers: [],
      students: [],
      schedules: [],
      rowsPerPageItems: [
        12,
        24,
        36,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
      ],
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 12,
        sortBy: 'created_at',
        totalItems: 12
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
      sound: null
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('camera', ['cameras']),
    ...mapState('detection', [
      'isLecturerDetecting',
      'isLecturerDetected',
      'detectedLecturer'
    ]),

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
    }
  },
  watch: {
    selectedCamera(selectedCamera) {
      this.initCamera(selectedCamera)
    }
  },
  async asyncData({ app: { $api, $handleError } }) {
    try {
      const { lecturers } = await $api.lecturers.fetchPage({
        limit: -1,
        withRelated: 'images.descriptor'
      })
      return {
        lecturers
      }
    } catch (error) {
      $handleError(error)
    }
  },
  async beforeMount() {
    await this.getModels()
    await this.initFaceMatcher()
  },
  async mounted() {
    await this.init()
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
      this.initSound()
      await this.getCameras()
      await this.initCamera(this.selectedCamera)
    },
    initSound() {
      this.sound = new Howl({
        src: '/sounds/slow-spring-board.mp3'
      })
    },
    async initCamera(deviceId) {
      try {
        const videoStream = await this.startCamera(deviceId)
        const videoEl = this.$refs.liveVideo
        const canvasEl = this.$refs.liveCanvas
        const canvasCtx = canvasEl.getContext('2d')
        videoEl.srcObject = videoStream
        this.onResetPhoto()
        await this.initLecturerFaceDetection({
          videoEl,
          canvasEl,
          canvasCtx,
          datasets: this.lecturers
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
      this.getFaceMatcher({ lecturers: this.lecturers })
    },
    async initLecturerFaceDetection({
      videoEl,
      canvasEl,
      canvasCtx,
      datasets
    }) {
      if (this.interval) {
        await clearIntervalAsync(this.interval)
      }
      this.$store.commit(`detection/${detectionTypes.LECTURER_DETECTING}`)
      this.interval = setIntervalAsync(async () => {
        try {
          const t0 = performance.now()
          drawImage(canvasCtx, videoEl, 0, 0, 720, 514, { isFlip: true })
          if (this.isLecturerDetecting) {
            const options = {
              isDetectionEnabled: this.selectedOptions.includes('detection'),
              isLandmarksEnabled: this.selectedOptions.includes('landmarks'),
              isRecognitionEnabled: this.selectedOptions.includes(
                'recognition'
              ),
              isExpressionEnabled: this.selectedOptions.includes('expression'),
              isAgeGenderEnabled: this.selectedOptions.includes('agegender')
            }
            const detection = await this.getFaceDetections({
              canvasEl,
              options
            })
            if (detection) {
              detection.recognition = await this.getBestMatch({
                descriptor: detection.descriptor,
                options
              })
              await (() => {
                console.log(new Date().toISOString(), detection)
                detection.detected = datasets.find(
                  ({ id }) => id === detection.recognition.label
                )
                if (detection.detected) {
                  this.drawBestMatch({
                    canvasEl,
                    canvasCtx,
                    detection,
                    options
                  })
                  this.$store.commit(
                    `detection/${detectionTypes.LECTURER_DETECTED}`
                  )
                  this.$store.commit(
                    `detection/${detectionTypes.SET_DETECTED_LECTURER}`,
                    detection.detected
                  )
                  this.sound.play()
                  this.clearFaceDetection()
                  this.fetchSchedules({ lecturer_id: detection.detected.id })
                }
              })()
              const t1 = performance.now()
              const diff = t1 - t0
              this.duration = parseFloat(diff)
              this.realFps = (1000 / diff).toFixed(2)
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
          room_id: this.user.profile.id,
          is_active: true,
          image
        })
        await this.$api.attendances.create(payload, {
          lecturer_id: this.detectedLecturer.id
        })
        await (() => {
          this.isChoosingSchedule = false
        })()
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchLecturers() {
      try {
        this.isLoading = true
        const { lecturers } = await this.$api.lecturers.fetchPage()
        this.lecturers = lecturers
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    // eslint-disable-next-line
    async fetchSchedules({ lecturer_id, room_id = this.user.profile.id }) {
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
        const { departments } = await this.$api.departments.fetchPage()
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
        const { studyPrograms } = await this.$api.studyPrograms.fetchPage()
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
        const { groups } = await this.$api.groups.fetchPage()
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
