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

import { types as cameraTypes } from '~/store/camera'

export default {
  data() {
    return {
      lecturerDescriptors: [],
      fps: 15,
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
        { text: 'Age', value: 'age', icon: 'cake' }
      ],
      selectedOptions: []
    }
  },
  computed: {
    ...mapState('camera', ['cameras']),
    prettyDuration() {
      return prettyMs(this.duration)
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
      const { lecturerDescriptors } = await $api.lecturerDescriptors.fetchPage({
        withRelated: 'lecturer_image'
      })
      return {
        lecturerDescriptors
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
    async init() {
      await this.getCameras()
      await this.initCamera(this.selectedCamera)
    },
    async initCamera(deviceId) {
      try {
        const videoStream = await this.startCamera(deviceId)
        this.$refs.liveVideo.srcObject = videoStream
      } catch (error) {
        this.$handleError(error)
      }
    }
  }
}
</script>
