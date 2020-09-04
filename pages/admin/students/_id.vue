<template>
  <v-row class="flex-wrap">
    <v-col cols="12">
      <v-row class="flex-wrap" justify="end">
        <v-col cols="12" sm="3">
          <v-autocomplete
            v-model="selectedStudent"
            label="Students"
            item-text="name"
            item-value="id"
            :items="students"
            outlined=""
          />
        </v-col>
      </v-row>
      <v-row class="flex-wrap">
        <v-col cols="12" md="4">
          <form @submit.prevent="onCreateOrEdit">
            <v-card>
              <v-app-bar flat="">
                <v-toolbar-title>
                  <h2 class="headline">{{ student.name }}</h2>
                </v-toolbar-title>
              </v-app-bar>
              <v-card-text>
                <v-row class="flex-wrap">
                  <v-col cols="12">
                    <validation-observer>
                      <validation-provider
                        #default="{ errors }"
                        name="Name"
                        rules="required"
                      >
                        <v-text-field
                          v-model="editedStudent.name"
                          :error-messages="errors"
                          :disabled="isLoading"
                          label="Name"
                          name="name"
                          required=""
                          clearable=""
                          outlined=""
                          autofocus=""
                        />
                      </validation-provider>
                    </validation-observer>
                  </v-col>
                </v-row>
                <v-row class="flex-wrap">
                  <v-col cols="12">
                    <validation-observer>
                      <validation-provider
                        #default="{ errors }"
                        name="Identifier"
                        rules="required"
                      >
                        <v-text-field
                          v-model="editedStudent.identifier"
                          :error-messages="errors"
                          :disabled="isLoading"
                          label="Identifier"
                          name="identifier"
                          required=""
                          clearable=""
                          outlined=""
                        />
                      </validation-provider>
                    </validation-observer>
                  </v-col>
                </v-row>
                <v-row class="flex-wrap">
                  <v-col cols="12">
                    <validation-observer>
                      <validation-provider
                        #default="{ errors }"
                        name="Study Program"
                        rules="required"
                      >
                        <v-autocomplete
                          v-model="editedStudent.study_program_id"
                          :error-messages="errors"
                          :disabled="isLoading"
                          :items="studyPrograms"
                          item-value="id"
                          item-text="name"
                          label="Study Program"
                          name="study_program_id"
                          required=""
                          clearable=""
                          outlined=""
                        />
                      </validation-provider>
                    </validation-observer>
                  </v-col>
                </v-row>
                <v-row class="flex-wrap">
                  <v-col cols="12">
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
                          item-value="id"
                          item-text="name"
                          label="Department"
                          name="selectedDepartment"
                          required=""
                          clearable=""
                          outlined=""
                        />
                      </validation-provider>
                    </validation-observer>
                  </v-col>
                </v-row>
                <v-row class="flex-wrap">
                  <v-col cols="12">
                    <validation-observer>
                      <validation-provider
                        #default="{ errors }"
                        name="Major"
                        rules="required"
                      >
                        <v-autocomplete
                          v-model="editedStudent.major_id"
                          :error-messages="errors"
                          :disabled="isLoading"
                          :items="majors"
                          item-value="id"
                          item-text="name"
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
                </v-row>
                <v-row class="flex-wrap">
                  <v-col cols="12" sm="6">
                    <validation-observer>
                      <validation-provider
                        #default="{ errors }"
                        name="Group"
                        rules="required"
                      >
                        <v-autocomplete
                          v-model="editedStudent.group_id"
                          :error-messages="errors"
                          :disabled="isLoading"
                          :items="groups"
                          item-value="id"
                          item-text="name"
                          label="Group"
                          name="group_id"
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
                        name="Grade"
                        rules="required"
                      >
                        <v-autocomplete
                          v-model="editedStudent.grade"
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
                <v-row class="flex-wrap">
                  <v-col cols="12">
                    <v-switch
                      v-model="editedStudent.is_active"
                      class="ma-0"
                      label="Is student active?"
                    />
                  </v-col>
                </v-row>
                <v-row class="flex-wrap">
                  <v-col cols="12" class="text-center">
                    <v-hover>
                      <template #default="{ hover }">
                        <app-avatar
                          :name="student.name"
                          :image="avatarImage.url"
                          :size="128"
                          text-class="headline"
                        >
                          <v-fade-transition>
                            <v-container
                              v-if="hover"
                              fluid=""
                              class="fill-height"
                              style="background-color: rgba(0, 0, 0, 0.5)"
                            >
                              <v-row
                                class="fill-height"
                                align="center"
                                justify="center"
                              >
                                <v-btn
                                  :disabled="isLoading"
                                  :loading="isLoading"
                                  color="error"
                                  @click="onRemoveImage"
                                >
                                  Remove
                                </v-btn>
                              </v-row>
                            </v-container>
                          </v-fade-transition>
                        </app-avatar>
                      </template>
                    </v-hover>
                  </v-col>
                </v-row>
                <v-row class="flex-wrap">
                  <v-col cols="12">
                    <input
                      ref="avatarImage"
                      class="d-none"
                      type="file"
                      name="image"
                      accept="image/jpeg,image/jpg"
                      @change="onAvatarImageSelected"
                    />
                    <v-btn
                      :disabled="isLoading"
                      :loading="isLoading"
                      color="primary"
                      @click="onSelectAvatarImage"
                    >
                      Select Image
                    </v-btn>
                    <span>{{ avatarImage.name }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="isLoading"
                  :loading="isLoading"
                  color="accent"
                  type="submit"
                  @click="onCreateOrEdit"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </form>
        </v-col>
        <v-col cols="12" md="8">
          <v-card>
            <v-app-bar flat="">
              <v-toolbar-title>Photo</v-toolbar-title>
            </v-app-bar>
            <v-card-text>
              <v-tabs v-model="currentTab" slider-color="primary" class="mb-3">
                <v-tab ripple="" href="#capture">Capture</v-tab>
                <v-tab ripple="" href="#file-upload">File Upload</v-tab>
              </v-tabs>
              <v-tabs-items v-model="currentTab">
                <v-tab-item value="capture">
                  <v-row class="flex-wrap">
                    <v-col cols="12" md="6">
                      <video
                        id="live-video"
                        ref="liveVideo"
                        width="720"
                        height="540"
                        autoplay=""
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <canvas
                        id="live-canvas"
                        ref="liveCanvas"
                        width="720"
                        height="540"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="flex-wrap">
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="selectedCamera"
                        :items="cameras"
                        label="Select Camera"
                        outlined=""
                        item-value="deviceId"
                        item-text="label"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-tooltip bottom="">
                        <template #activator="{ on }">
                          <v-btn
                            v-long-press="300"
                            color="accent"
                            class="ma-1"
                            v-on="on"
                            @click="onTakePhoto"
                            @long-press-start="onTakePhotoLongPressedStart"
                            @long-press-stop="onTakePhotoLongPressedStop"
                          >
                            Take a Photo
                          </v-btn>
                        </template>
                        <span>Make a long click to start burst shot</span>
                      </v-tooltip>
                      <v-btn
                        :disabled="isLoading"
                        :loading="isLoading"
                        class="ma-1"
                        color="error"
                        @click="onResetPhoto"
                      >
                        Reset
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item value="file-upload">
                  <v-row class="flex-wrap">
                    <v-col cols="12" md="6">
                      <v-img
                        src="/examples/images/tony-stark.jpg"
                        :aspect-ratio="456 / 400"
                        class="mb-3"
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
                      <h2 class="headline success--text">Good</h2>
                      <ol class="body-2">
                        <li>Face must be clearly visible</li>
                        <li>
                          Face must not covered with glasses, masks or other
                          objects that can cover
                        </li>
                        <li>If only one photo, face must face forward</li>
                        <li>
                          If more than one photo, at least there are 4 photos,
                          faces face up, down, right and left
                        </li>
                        <li>
                          Image resolution must be greater or equal than 720x540
                        </li>
                      </ol>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-img
                        src="/examples/images/iron-man.jpg"
                        :aspect-ratio="456 / 400"
                        class="mb-3"
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
                      <h2 class="headline error--text">Bad</h2>
                      <ol class="body-2">
                        <li>Face isn't clearly visible</li>
                        <li>
                          Face is covered with glasses, masks or other objects
                          that can cover
                        </li>
                      </ol>
                    </v-col>
                  </v-row>
                  <v-row class="flex-wrap">
                    <v-col cols="12">
                      <input
                        ref="images"
                        class="d-none"
                        type="file"
                        name="image"
                        accept="image/jpeg,image/jpg"
                        multiple
                        @change="onImagesSelected"
                      />
                      <v-btn
                        :disabled="isLoading"
                        :loading="isLoading"
                        color="primary"
                        @click="onSelectImages"
                      >
                        Select Images
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="flex-wrap">
        <v-col cols="12">
          <v-card>
            <v-app-bar flat="">
              <v-toolbar-title>Photos</v-toolbar-title>
              <v-spacer />
              <v-fade-transition>
                <v-btn
                  v-if="removingImages.length > 0"
                  class="ma-1"
                  color="error"
                  @click="isRemoving = true"
                >
                  Remove {{ pluralize('image', removingImages.length, true) }}
                </v-btn>
              </v-fade-transition>
              <v-btn class="ma-1" color="accent" @click="onSelectAllImages">
                {{ isAllImagesSelected ? 'Unselect All' : 'Select All' }}
              </v-btn>
            </v-app-bar>
            <v-card-text>
              <v-container fluid="">
                <v-data-iterator
                  :items="studentImages"
                  :footer-props="{
                    'items-per-page-options': rowsPerPageItems
                  }"
                  :options.sync="pagination"
                  :server-items-length="totalItems"
                  :loading="isLoading"
                >
                  <template #default="{ items }">
                    <v-row class="flex-wrap">
                      <v-col
                        v-for="item in items"
                        :key="item.id"
                        cols="12"
                        sm="6"
                        md="4"
                        class="d-flex"
                      >
                        <v-hover>
                          <template #default="{ hover }">
                            <v-card text="" tile="" class="d-flex">
                              <v-img
                                :src="item.path"
                                :width="720"
                                :aspect-ratio="720 / 540"
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
                                <v-fade-transition>
                                  <v-container
                                    v-if="removingImages.includes(item.id)"
                                    fluid=""
                                    class="fill-height"
                                    style="background-color: rgba(0, 0, 0, 0.5)"
                                  >
                                    <v-row
                                      class="fill-height flex-wrap"
                                      align="center"
                                      justify="center"
                                    >
                                      <v-btn
                                        :disabled="isLoading"
                                        :loading="isLoading"
                                        color="accent"
                                        @click="onTriggerSelecting(item.id)"
                                      >
                                        Unselect
                                      </v-btn>
                                    </v-row>
                                  </v-container>
                                </v-fade-transition>
                                <v-fade-transition>
                                  <v-container
                                    v-if="hover"
                                    fluid=""
                                    class="fill-height"
                                    style="background-color: rgba(0, 0, 0, 0.5)"
                                  >
                                    <v-row
                                      class="fill-height flex-wrap"
                                      align="center"
                                      justify="center"
                                    >
                                      <v-btn
                                        :disabled="isLoading"
                                        :loading="isLoading"
                                        color="primary"
                                        class="ma-1"
                                        @click="onUseAsAvatar(item.path)"
                                      >
                                        Use as Avatar
                                      </v-btn>
                                      <v-btn
                                        :disabled="isLoading"
                                        :loading="isLoading"
                                        color="accent"
                                        class="ma-1"
                                        @click="onTriggerSelecting(item.id)"
                                      >
                                        Select
                                      </v-btn>
                                    </v-row>
                                  </v-container>
                                </v-fade-transition>
                              </v-img>
                            </v-card>
                          </template>
                        </v-hover>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-container>
              <v-tooltip left="">
                <template #activator="{ on }">
                  <v-fade-transition>
                    <v-btn
                      v-if="removingImages.length > 0"
                      color="error"
                      fab=""
                      bottom=""
                      right=""
                      fixed=""
                      v-on="on"
                      @click="isRemoving = true"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-fade-transition>
                </template>
                <span>
                  Remove {{ pluralize('image', removingImages.length, true) }}
                </span>
              </v-tooltip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="isRemoving" width="350" @input="onCloseRemoving">
        <v-card>
          <v-card-text class="pt-5">
            <div class="body-2">
              Are you sure you want to remove
              {{ pluralize('image', removingImages.length, true) }}?
            </div>
          </v-card-text>
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
              @click="onRemoveTrainingImage(removingImages)"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { validate } from 'vee-validate'
import { mapState, mapActions } from 'vuex'
import {
  setIntervalAsync,
  clearIntervalAsync
} from 'set-interval-async/dynamic'
import uuidValidate from 'uuid-validate'
import toFormData from 'json-form-data'
import cloneDeep from 'lodash/fp/cloneDeep'

import { getImageFromCanvas, drawImage } from '~/utils/canvas'
import { fileReader, getFileFromUrl } from '~/utils/file'

import string from '~/mixins/string'

import { types as cameraTypes } from '~/store/camera'

export default {
  validate({ params: { id = '' } }) {
    return uuidValidate(id, 4)
  },
  mixins: [string],
  async asyncData({ app: { $api, $handleError }, params: { id = '' } }) {
    try {
      const [
        { student },
        { rowCount, studentImages, ...filter }
      ] = await Promise.all([
        $api.students.fetch(id, { withRelated: 'study_program,major,group' }),
        $api.studentImages.fetchPage({
          orderBy: '-created_at',
          limit: 12,
          offset: 0,
          student_id: id
        })
      ])
      const [
        { students },
        { departments },
        { studyPrograms },
        { majors },
        { groups }
      ] = await Promise.all([
        $api.students.fetchPage({
          orderBy: 'identifier',
          study_program_id: student.study_program_id,
          major_id: student.major_id,
          group_id: student.group_id,
          limit: -1
        }),
        $api.departments.fetchPage({ limit: -1 }),
        $api.studyPrograms.fetchPage({ limit: -1 }),
        $api.majors.fetchPage({
          department_id: student.major.department_id,
          limit: -1
        }),
        $api.groups.fetchPage({ limit: -1 })
      ])
      return {
        selectedStudent: id,
        students,
        student,
        selectedDepartment: student.major.department_id,
        departments,
        majors,
        studyPrograms,
        groups,
        studentImages,
        studentImagesFilter: filter,
        totalItems: rowCount
      }
    } catch (error) {
      $handleError(error)
    }
  },
  data() {
    return {
      selectedStudent: null,
      students: [],
      isLoading: false,
      departments: [],
      majors: [],
      studyPrograms: [],
      groups: [],
      selectedDepartment: null,
      student: {
        id: null,
        name: null,
        identifier: null,
        image: null,
        grade: null,
        is_active: true,
        user_id: null,
        study_program_id: null,
        major_id: null,
        group_id: null,
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
          department_id: null
        },
        group: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null
        }
      },
      editedStudent: {
        id: null,
        name: null,
        identifier: null,
        image: null,
        grade: null,
        is_active: true,
        user_id: null,
        study_program_id: null,
        major_id: null,
        group_id: null,
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
          department_id: null
        },
        group: {
          id: null,
          created_at: null,
          updated_at: null,
          name: null
        }
      },
      avatarImage: {
        name: '',
        url: '',
        file: null
      },

      currentTab: 'capture',
      studentImages: [],
      studentImagesFilter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: '-created_at',
        withDescriptor: 0
      },
      rowsPerPageItems: [
        12,
        24,
        36,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
      ],
      pagination: {
        sortDesc: [true],
        page: 1,
        itemsPerPage: 12,
        sortBy: ['created_at']
      },
      totalItems: 0,

      isRemoving: false,
      isAllImagesSelected: false,
      removingImages: [],
      longPressedInterval: null,
      isLongPressed: false
    }
  },
  computed: {
    ...mapState('face', ['isLoaded']),
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
    },
    grades() {
      const grades = []
      const studyProgram = this.studyPrograms.find(
        ({ id }) => id === this.editedStudent.study_program_id
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
    currentTab(currentTab) {
      if (currentTab === 'capture') {
        this.initCamera()
      } else {
        this.stopCamera()
      }
    },
    async 'avatarImage.file'(file) {
      await this.onCreateOrEdit(null, {
        ...this.editedStudent,
        image: file
      })
    },
    // eslint-disable-next-line
    'editedStudent.study_program_id': function (study_program_id) {
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
      if (this.editedStudent.study_program_id && selectedDepartment) {
        this.fetchMajors({
          study_program_id: this.editedStudent.study_program_id,
          department_id: selectedDepartment
        })
      } else {
        this.majors = []
      }
    },
    selectedCamera(selectedCamera) {
      this.initCamera(selectedCamera)
    },
    pagination: {
      handler({ sortDesc, page, itemsPerPage, sortBy }) {
        this.fetchImages({
          orderBy: sortBy,
          limit: itemsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * itemsPerPage,
          sortDesc
        })
      },
      deep: true
    },
    selectedStudent(selectedStudent) {
      this.$router.push({
        name: 'admin-students-id',
        params: { id: selectedStudent }
      })
    }
  },
  beforeMount() {
    this.getModels()
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.stopCamera()
  },
  methods: {
    ...mapActions('camera', ['startCamera', 'stopCamera', 'getCameras']),
    ...mapActions('face', ['getModels', 'getFaceDescriptors']),
    async init() {
      await this.fetchStudent()
      await Promise.all([this.prefillData(), this.getCameras()])
      await this.initCamera()
    },
    async prefillData() {
      try {
        const { image, ...restData } = this.student
        delete restData.id
        delete restData.study_program
        delete restData.major
        delete restData.group

        const imageFile = await getFileFromUrl(image)

        this.editedStudent = {
          ...restData,
          image: imageFile
        }

        this.avatarImage.url = image
      } catch (error) {
        this.$handleError(error)
      }
    },
    async initCamera(deviceId) {
      if (!deviceId) {
        if (this.cameras.length > 0) {
          const [camera] = this.cameras
          if (camera) {
            this.$store.commit(
              `camera/${cameraTypes.SET_SELECTED_CAMERA}`,
              camera
            )
            deviceId = camera.deviceId
          }
        }
        try {
          const videoStream = await this.startCamera(deviceId)
          this.$refs.liveVideo.srcObject = videoStream
        } catch (error) {
          this.$handleError(error)
        }
      }
    },
    async fetchStudents() {
      try {
        this.isLoading = true
        const { students } = await this.$api.students.fetchPage()
        this.students = students
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
        const { groups } = await this.$api.groups.fetchPage()
        this.groups = groups
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchStudent() {
      try {
        this.isLoading = true
        const { id } = this.$route.params
        const { student } = await this.$api.students.fetch(id, {
          withRelated: 'study_program,major,group'
        })
        this.student = student
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchImages(
      {
        orderBy = this.pagination.sortBy,
        limit = this.pagination.itemsPerPage,
        offset = (this.pagination.page - 1) * this.pagination.itemsPerPage,
        sortDesc = this.pagination.sortDesc
      } = {
        orderBy: this.pagination.sortBy,
        limit: this.pagination.itemsPerPage,
        offset: (this.pagination.page - 1) * this.pagination.itemsPerPage,
        sortDesc: this.pagination.sortDesc
      }
    ) {
      try {
        this.isLoading = true
        const { id } = this.$route.params
        if (sortDesc[0]) {
          orderBy = `-${orderBy[0]}`
        }
        // eslint-disable-next-line
        const {
          rowCount,
          studentImages,
          ...filter
        } = await this.$api.studentImages.fetchPage({
          orderBy,
          limit,
          offset,
          student_id: id
        })
        this.studentImages = studentImages
        this.studentImagesFilter = filter
        this.totalItems = rowCount
        if (rowCount > 0) {
          setTimeout(() => {}, 1000)
        }
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    onSelectAvatarImage() {
      this.$refs.avatarImage.click()
    },
    async onAvatarImageSelected(event) {
      try {
        const {
          target: { files = [] }
        } = event
        if (files.length > 0) {
          const [file] = files
          if (file !== null) {
            const url = await fileReader(file)
            this.avatarImage = {
              name: file.name,
              url,
              file
            }
          }
        }
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.$refs.avatarImage.value = null
      }
    },
    onSelectImages() {
      this.$refs.images.click()
    },
    async computeImageDescriptors(image) {
      if (this.isLoaded) {
        const descriptor = await this.getFaceDescriptors({ image })
        if (descriptor) {
          await this.$api.studentDescriptors.create({
            studentDescriptor: { student_image_id: image.id, descriptor }
          })
          await this.$api.studentImages.update(image.id, {
            studentImage: { has_descriptor: true }
          })
        }
      } else {
        await this.getModels()
      }
    },
    async onImagesSelected(event) {
      try {
        const {
          target: { files }
        } = event
        if (files.length > 0) {
          const { id } = this.$route.params
          // Taken from: https://stackoverflow.com/a/55781766/7711812
          const payload = new FormData()
          payload.append('has_descriptor', false)
          // Taken from: https://stackoverflow.com/a/40902462/7711812
          const filesArray = Array.from(files)
          filesArray.forEach((file) => {
            payload.append('images', file)
          })
          const { studentImages } = await this.$api.studentImages.create(
            payload,
            {
              student_id: id
            }
          )
          await Promise.all(
            studentImages.map((image) => this.computeImageDescriptors(image))
          )
          await Promise.all([
            this.fetchImages(),
            this.$notify({
              kind: 'success',
              message: `${this.pluralize(
                'Photo',
                filesArray.length,
                true
              )} ${this.pluralize(
                'is',
                filesArray.length
              )} uploaded and trained successfully`
            })
          ])
        }
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.$refs.images.value = null
      }
    },
    async onTakePhoto() {
      try {
        this.isLoading = true
        const { id } = this.$route.params
        const video = this.$refs.liveVideo
        const canvas = this.$refs.liveCanvas
        const canvasCtx = canvas.getContext('2d')
        drawImage(canvasCtx, video, 0, 0, 720, 540, { isFlip: true })
        const image = await getImageFromCanvas(canvas)
        let payload = {
          images: image,
          has_descriptor: false
        }
        payload = toFormData(payload)
        const { studentImages } = await this.$api.studentImages.create(
          payload,
          {
            student_id: id
          }
        )
        await this.computeImageDescriptors(studentImages[0])
        await Promise.all([
          this.fetchImages(),
          this.$notify({
            kind: 'success',
            message: 'Photo is uploaded and trained successfully'
          })
        ])
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    onTakePhotoLongPressedStart() {
      this.isLongPressed = true
      this.longPressedInterval = setIntervalAsync(async () => {
        await this.onTakePhoto()
      }, 300)
    },
    async onTakePhotoLongPressedStop() {
      if (this.longPressedInterval !== null) {
        this.isLongPressed = false
        await clearIntervalAsync(this.longPressedInterval)
      }
    },
    onResetPhoto() {
      const canvas = this.$refs.liveCanvas
      const canvasCtx = canvas.getContext('2d')
      canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height)
      canvasCtx.beginPath()
    },
    async onRemoveImage() {
      await this.onCreateOrEdit(null, {
        ...this.editedStudent,
        image: ''
      })
      this.avatarImage = {
        name: '',
        url: '',
        file: null
      }
    },
    onTriggerSelecting(id) {
      if (this.removingImages.includes(id)) {
        const removingId = this.removingImages.findIndex(
          (imageId) => imageId === id
        )
        this.removingImages.splice(removingId, 1)
      } else {
        this.removingImages.push(id)
      }
    },
    onCloseRemoving(event, isReset = false) {
      this.isRemoving = false
      if (isReset) {
        this.removingImages = []
        this.isAllImagesSelected = false
      }
    },
    async onRemoveTrainingImage(removingImages = []) {
      try {
        this.isLoading = true
        if (removingImages.length > 0) {
          await Promise.all(
            removingImages.map((id) => this.$api.studentImages.destroy(id))
          )
          await Promise.all([
            this.fetchImages(),
            this.onCloseRemoving(null, true),
            this.$notify({
              kind: 'success',
              message: `${this.pluralize(
                'Photo',
                removingImages.length,
                true
              )} ${this.pluralize(
                'is',
                removingImages.length
              )} removed successfully`
            })
          ])
        }
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async onUseAsAvatar(path) {
      const payload = {
        ...this.editedStudent,
        image: await getFileFromUrl(path)
      }
      await this.onCreateOrEdit(null, payload)
    },
    onSelectAllImages() {
      if (!this.isAllImagesSelected) {
        this.removingImages.push(...this.studentImages.map(({ id }) => id))
      } else {
        this.removingImages = []
      }
      this.isAllImagesSelected = !this.isAllImagesSelected
    },
    async onCreateOrEdit(event, _payload = this.editedStudent) {
      try {
        const valids = await Promise.all(
          Object.keys(this.student)
            .filter((i) => i !== 'id')
            .map((i) => validate(this.student[i], 'required'))
        )
        if (valids.every(({ valid }) => valid)) {
          this.isLoading = true

          let payload = cloneDeep(_payload)

          payload = {
            ...payload,
            updated_at: new Date().toISOString()
          }

          if (payload.image) {
            payload = toFormData(payload)
          } else {
            payload = {
              student: payload
            }
          }

          const {
            params: { id }
          } = this.$route
          await this.$api.students.update(id, payload, {
            student_id: this.student.id
          })
          await this.fetchStudent()
          await Promise.all([
            this.prefillData(),
            this.$notify({
              kind: 'success',
              message: 'Profile is updated successfully'
            })
          ])
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
  },
  head() {
    return {
      title: `Edit Student - ${this.student.name}`
    }
  }
}
</script>
