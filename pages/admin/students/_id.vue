<template>
  <v-layout row="" wrap="">
    <v-flex xs12="" sm4="">
      <v-card>
        <v-toolbar card="">
          <v-toolbar-title>
            <h2 class="headline">{{ user.name }}</h2>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-layout row="" wrap="">
            <v-flex xs12="">
              <v-text-field
                v-model="editedUser.name"
                v-validate="'required'"
                :error-messages="errors.collect('name')"
                :disabled="isLoading"
                label="Name"
                data-vv-name="name"
                data-vv-as="name"
                required=""
                clearable=""
                box=""
                autofocus=""
                data-vv-value-path="editedUser.name"
              />
            </v-flex>
          </v-layout>
          <v-layout row="" wrap="">
            <v-flex xs12="">
              <v-text-field
                v-model="editedUser.username"
                v-validate="'required'"
                :error-messages="errors.collect('username')"
                :disabled="isLoading"
                label="Username"
                data-vv-name="username"
                data-vv-as="username"
                required=""
                clearable=""
                box=""
                data-vv-value-path="editedUser.username"
              />
            </v-flex>
          </v-layout>
          <v-layout row="" wrap="">
            <v-flex xs12="" class="text-xs-center">
              <v-hover>
                <template #default="{ hover }">
                  <app-avatar
                    :name="user.name"
                    :image="image.url"
                    :size="128"
                    text-class="headline"
                  >
                    <v-fade-transition>
                      <v-container
                        v-if="hover"
                        fluid=""
                        fill-height=""
                        style="background-color: rgba(0, 0, 0, .5)"
                      >
                        <v-layout
                          fill-height=""
                          align-center=""
                          justify-center=""
                        >
                          <v-btn
                            color="error"
                            large=""
                            icon=""
                            @click="onRemoveImage"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-layout>
                      </v-container>
                    </v-fade-transition>
                  </app-avatar>
                </template>
              </v-hover>
            </v-flex>
          </v-layout>
          <v-layout row="" wrap="">
            <v-flex xs12="">
              <input
                ref="image"
                style="display: none"
                type="file"
                name="image"
                accept="image/jpeg,image/jpg"
                @change="onImageSelected"
              />
              <v-btn color="primary" @click="onSelectImage">Select Image</v-btn>
              <span>{{ image.name }}</span>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="isLoading"
            :loading="isLoading"
            color="accent"
            @click="onSave"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12="" sm8="">
      <v-card>
        <v-toolbar card="">
          <v-toolbar-title>Photo</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-tabs v-model="currentTab" slider-color="primary" class="mb-3">
            <v-tab ripple="" href="#capture">Capture</v-tab>
            <v-tab ripple="" href="#file-upload">File Upload</v-tab>
          </v-tabs>
          <v-tabs-items v-model="currentTab">
            <v-tab-item value="capture">
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <video
                    id="live-video"
                    ref="liveVideo"
                    width="720"
                    height="480"
                    autoplay=""
                  />
                </v-flex>
                <v-flex xs12="" sm6="">
                  <canvas
                    id="live-canvas"
                    ref="liveCanvas"
                    width="720"
                    height="480"
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="" sm6="">
                  <v-select
                    v-model="selectedCamera"
                    :items="cameras"
                    label="Select Camera"
                    box=""
                    item-value="deviceId"
                    item-text="label"
                  />
                </v-flex>
                <v-flex xs12="" sm6="">
                  <v-btn color="accent" @click="onTakePhoto">
                    Take a Photo
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item value="file-upload">File Upload</v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import uuidValidate from 'uuid-validate'
import toFormData from 'json-form-data'

import fileReader from '~/utils/file-reader'

import urlToFile from '~/mixins/url-to-file'

import AppAvatar from '~/components/AppAvatar'

import { types as cameraTypes } from '~/store/camera'

export default {
  validate({ params: { id = '' }, query, store }) {
    return uuidValidate(id, 4)
  },
  components: {
    AppAvatar
  },
  mixins: [urlToFile],
  data() {
    return {
      isLoading: false,
      isNotify: false,
      user: {
        name: '',
        username: '',
        image: ''
      },
      editedUser: {
        name: '',
        username: '',
        image: ''
      },
      image: {
        name: '',
        url: '',
        file: null
      },

      currentTab: 'capture'
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
  watch: {
    'image.file': function(file) {
      this.editedUser.image = file
    },
    'editedUser.image': function(file) {
      this.onSave()
    },
    selectedCamera(selectedCamera) {
      this.initCamera(selectedCamera)
    }
  },
  async asyncData({ app: { $api, $handleError }, params: { id = '' } }) {
    try {
      const { user } = await $api.users.getOnce(id)
      return {
        user
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
      await Promise.all([this.initData(), this.getCameras()])
      await this.initCamera(this.selectedCamera)
    },
    async initData() {
      const { name, username, image } = this.user
      const imageFile = await this.getFileFromUrl(image)
      this.editedUser = {
        name,
        username,
        image: imageFile
      }
      this.image.url = image
    },
    async initCamera(deviceId) {
      if (this.currentTab === 'capture') {
        const videoStream = await this.startCamera(deviceId)
        this.$refs.liveVideo.srcObject = videoStream
      } else {
        await this.stopCamera()
      }
    },
    onSelectImage() {
      this.$refs.image.click()
    },
    async onImageSelected(event) {
      const file = event.target.files[0]
      if (file !== null) {
        const url = await fileReader(file)
        this.image = {
          name: file.name,
          url,
          file
        }
      }
    },
    onTakePhoto() {
      const video = this.$refs.liveVideo
      const canvas = this.$refs.liveCanvas
      const canvasCtx = canvas.getContext('2d')
      canvasCtx.drawImage(video, 0, 0, 720, 480)
    },
    onRemoveImage() {
      this.editedUser.image = ''
      this.image = {
        name: '',
        url: '',
        file: null
      }
    },
    async onSave() {
      try {
        const valid = await this.$validator.validate()
        if (valid) {
          this.isLoading = true
          const formData = toFormData(this.editedUser)
          const {
            params: { id }
          } = this.$route
          const { user } = await this.$api.users.update(id, formData)
          return user
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
    }
  }
}
</script>

<style>
#live-video,
#live-canvas {
  height: auto;
  width: 100%;
  transform: scaleX(-1);
}
</style>
