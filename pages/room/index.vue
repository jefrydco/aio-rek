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
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <video
                    id="live-video"
                    ref="liveVideo"
                    style="display: none"
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
                  Presences
                </h2>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <canvas
                id="live-result"
                ref="liveResult"
                width="720"
                height="540"
              />
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

import { types as cameraTypes } from '~/store/camera'

export default {
  data() {
    return {
      isLoading: false,
      interval: null,
      lecturers: [],
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
      isDrawing: true,
      detectedLecturer: null
    }
  },
  computed: {
    ...mapState('camera', ['cameras']),
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
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('camera', ['startCamera', 'stopCamera', 'getCameras']),
    ...mapActions('face', [
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
        this.$refs.liveVideo.srcObject = videoStream
        await this.initFaceDetection({
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
    initFaceDetection({ videoEl, canvasEl, canvasCtx, datasets }) {
      if (this.interval) {
        clearInterval(this.interval)
      }
      this.interval = setInterval(async () => {
        try {
          const t0 = performance.now()
          drawImage(canvasCtx, videoEl, 0, 0, 720, 514, { isFlip: true })
          const options = {
            detectionsEnabled: this.selectedOptions.includes('detection'),
            landmarksEnabled: this.selectedOptions.includes('landmarks'),
            descriptorsEnabled: this.selectedOptions.includes('recognition'),
            ageGenderEnabled: this.selectedOptions.includes('agegender')
          }
          const detections = await this.getFaceDetections({ canvasEl, options })
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
                this.detectedLecturer = detection.detected
                this.drawBestMatch({
                  canvasEl,
                  canvasCtx,
                  detection,
                  options
                })
                clearInterval(this.interval)
              }
            })
            const t1 = performance.now()
            const diff = t1 - t0
            this.duration = parseFloat(diff)
            this.realFps = (1000 / diff).toFixed(2)
          }
        } catch (error) {
          console.error(error)
        }
      }, 1000 / this.fps)
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
