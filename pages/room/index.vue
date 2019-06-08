<template>
  <v-layout row="" wrap="">
    <v-flex xs12="">
      <v-layout row="" wrap="">
        <v-flex xs12="" md6="">
          <v-card>
            <v-toolbar card=""> </v-toolbar>
            <v-card-text>
              <video
                id="live-video"
                ref="liveVideo"
                width="720"
                height="540"
                autoplay=""
              />
              <canvas
                id="live-canvas"
                ref="liveCanvas"
                width="720"
                height="540"
              />
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12="" md6="">
          <v-card>
            <v-toolbar card=""></v-toolbar>
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
import { mapState, mapActions } from 'vuex'

import { types as cameraTypes } from '~/store/camera'

export default {
  data() {
    return {
      images: [],
      imagesFilter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: '-created_at',
        withDescriptor: 0
      },
      totalItems: 0
    }
  },
  computed: {
    ...mapState('camera', ['cameras']),
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
  async asyncData({
    app: {
      $api: { users, images },
      $handleError
    }
  }) {
    try {
      const {
        images: { rowCount, images: imagesData, ...filter }
      } = await images.getAll({
        orderBy: '-created_at',
        limit: 9,
        offset: 0,
        withDescriptor: 1
      })
      return {
        images: imagesData,
        imagesFilter: filter,
        totalItems: rowCount
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
