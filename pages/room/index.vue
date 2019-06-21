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
                    box=""
                    item-value="deviceId"
                    item-text="label"
                  />
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
                  <v-item-group v-model="selectedOptions" multiple="">
                    <v-layout row="" wrap="">
                      <v-flex
                        v-for="(option, i) in options"
                        :key="`option_${i}`"
                        xs12=""
                        md3=""
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
              <v-layout row="" wrap="">
                <v-flex xs12="" class="text-xs-center">
                  <v-fade-transition mode="out-in">
                    <div v-if="isLecturerDetected">
                      <h3 class="display-1 mb-3">
                        {{ detectedLecturer.name }}
                      </h3>
                      <v-btn large="" color="accent">Start</v-btn>
                    </div>
                    <h3 v-else="" class="headline">
                      Point Your face at the camera
                    </h3>
                  </v-fade-transition>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import prettyMs from 'pretty-ms'
import { mapState, mapActions } from 'vuex'
import { drawImage } from '~/utils/canvas'

import { types as detectionTypes } from '~/store/detection'
import { types as cameraTypes } from '~/store/camera'

export default {
  data() {
    return {
      isLoading: false,
      interval: null,
      lecturers: [],
      students: [],
      fps: 9,
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
        { text: 'Age & Gender', value: 'agegender', icon: 'cake' }
      ],
      selectedOptions: ['agegender', 'recognition', 'landmarks', 'detection'],
      isDrawing: true
    }
  },
  computed: {
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
  beforeMount() {
    this.getModels()
  },
  mounted() {
    this.init()
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
      await this.getCameras()
      await this.initCamera(this.selectedCamera)
      await this.initFaceMatcher()
    },
    async initCamera(deviceId) {
      try {
        const videoStream = await this.startCamera(deviceId)
        const videoEl = this.$refs.liveVideo
        const canvasEl = this.$refs.liveCanvas
        const canvasCtx = canvasEl.getContext('2d')
        videoEl.srcObject = videoStream
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
    initFaceMatcher() {
      this.getFaceMatcher({ lecturers: this.lecturers })
    },
    initLecturerFaceDetection({ videoEl, canvasEl, canvasCtx, datasets }) {
      if (this.interval) {
        clearInterval(this.interval)
      }
      this.interval = setInterval(async () => {
        try {
          const t0 = performance.now()
          drawImage(canvasCtx, videoEl, 0, 0, 720, 514, { isFlip: true })
          this.$store.commit(`detection/${detectionTypes.LECTURER_DETECTING}`)
          if (this.isLecturerDetecting) {
            const options = {
              detectionsEnabled: this.selectedOptions.includes('detection'),
              landmarksEnabled: this.selectedOptions.includes('landmarks'),
              descriptorsEnabled: this.selectedOptions.includes('recognition'),
              ageGenderEnabled: this.selectedOptions.includes('agegender')
            }
            const detections = await this.getFaceDetections({
              canvasEl,
              options
            })
            if (detections.length > 0) {
              detections.forEach(async detection => {
                detection.recognition = await this.getBestMatch({
                  descriptor: detection.descriptor,
                  options
                })
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
                  this.clearFaceDetection()
                }
              })
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
    clearFaceDetection() {
      clearInterval(this.interval)
      this.duration = 0
      this.realFps = 0
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
    }
  }
}
</script>
