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
                  Attendance
                </h2>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-container class="pa-0" fluid="" grid-list-xl="">
                <v-layout v-if="isStudentDetected" row="" wrap="">
                  <v-flex xs12=""> </v-flex>
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
import prettyMs from 'pretty-ms'
import { mapState, mapActions } from 'vuex'
import {
  setIntervalAsync,
  clearIntervalAsync
} from 'set-interval-async/dynamic'
import { drawImage } from '~/utils/canvas'

import { types as detectionTypes } from '~/store/detection'
import { types as cameraTypes } from '~/store/camera'
import string from '~/mixins/string'

export default {
  mixins: [string],
  data() {
    return {
      isLoading: false,
      interval: null,
      attendance: null,
      students: [],
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
      'isStudentDetecting',
      'isStudentDetected',
      'detectedStudent'
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
      const { students } = await $api.students.fetchPage({
        limit: -1,
        withRelated: 'images.descriptor'
      })
      return {
        students
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
      await this.fetchAttendances({ room_id: this.user.profile.id })
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
        await this.initStudentFaceDetection({
          videoEl,
          canvasEl,
          canvasCtx,
          datasets: this.students
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
      this.getFaceMatcher({ datasets: this.students })
    },
    async initStudentFaceDetection({ videoEl, canvasEl, canvasCtx, datasets }) {
      if (this.interval) {
        await clearIntervalAsync(this.interval)
      }
      this.$store.commit(`detection/${detectionTypes.STUDENTS_DETECTING}`)
      this.interval = setIntervalAsync(async () => {
        try {
          const t0 = performance.now()
          drawImage(canvasCtx, videoEl, 0, 0, 720, 514, { isFlip: true })
          if (this.isStudentDetecting) {
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
                    `detection/${detectionTypes.STUDENTS_DETECTED}`
                  )
                  this.$store.commit(
                    `detection/${detectionTypes.SET_DETECTED_STUDENTS}`,
                    detection.detected
                  )
                  this.sound.play()
                  // this.clearFaceDetection()
                  // this.fetchSchedules({ lecturer_id: detection.detected.id })
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
    // eslint-disable-next-line
    async fetchAttendances({ room_id }) {
      try {
        this.isLoading = true
        const { attendances } = await this.$api.attendances.fetchPage({
          limit: -1,
          withRelated: 'schedule,room',
          is_active: true,
          room_id
        })
        this.attendance = attendances[0]
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
