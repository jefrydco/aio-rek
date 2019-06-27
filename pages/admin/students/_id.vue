<template>
  <v-layout row="" wrap="">
    <v-flex xs12="">
      <v-layout row="" wrap="" justify-end="">
        <v-flex xs12="" sm3="">
          <v-autocomplete
            v-model="selectedStudent"
            label="Students"
            item-text="name"
            item-value="id"
            :items="students"
            outline=""
          />
        </v-flex>
      </v-layout>
      <v-layout row="" wrap="">
        <v-flex xs12="" md4="">
          <form @submit.prevent="onCreateOrEdit">
            <v-card>
              <v-toolbar card="">
                <v-toolbar-title>
                  <h2 class="headline">{{ student.name }}</h2>
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-layout row="" wrap="">
                  <v-flex xs12="">
                    <v-text-field
                      v-model="editedStudent.name"
                      v-validate="'required'"
                      :error-messages="errors.collect('name')"
                      :disabled="isLoading"
                      label="Name"
                      data-vv-name="name"
                      data-vv-as="name"
                      name="name"
                      required=""
                      clearable=""
                      outline=""
                      autofocus=""
                      data-vv-value-path="editedStudent.name"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row="" wrap="">
                  <v-flex xs12="">
                    <v-text-field
                      v-model="editedStudent.identifier"
                      v-validate="'required'"
                      :error-messages="errors.collect('identifier')"
                      :disabled="isLoading"
                      label="Identifier"
                      data-vv-name="identifier"
                      data-vv-as="identifier"
                      name="identifier"
                      required=""
                      clearable=""
                      outline=""
                      data-vv-value-path="editedStudent.identifier"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row="" wrap="">
                  <v-flex xs12="">
                    <v-autocomplete
                      v-model="editedStudent.study_program_id"
                      v-validate="'required'"
                      :error-messages="errors.collect('study_program_id')"
                      :disabled="isLoading"
                      :items="studyPrograms"
                      item-value="id"
                      item-text="name"
                      label="Study Program"
                      data-vv-name="study_program_id"
                      data-vv-as="study program"
                      name="study_program_id"
                      required=""
                      clearable=""
                      outline=""
                      data-vv-value-path="editedStudent.study_program_id"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row="" wrap="">
                  <v-flex xs12="">
                    <v-autocomplete
                      v-model="selectedDepartment"
                      v-validate="'required'"
                      :error-messages="errors.collect('selectedDepartment')"
                      :disabled="isLoading"
                      :items="departments"
                      item-value="id"
                      item-text="name"
                      label="Department"
                      data-vv-name="selectedDepartment"
                      data-vv-as="department"
                      name="selectedDepartment"
                      required=""
                      clearable=""
                      outline=""
                      data-vv-value-path="selectedDepartment"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row="" wrap="">
                  <v-flex xs12="">
                    <v-autocomplete
                      v-model="editedStudent.major_id"
                      v-validate="'required'"
                      :error-messages="errors.collect('major_id')"
                      :disabled="isLoading"
                      :items="majors"
                      item-value="id"
                      item-text="name"
                      label="Major"
                      data-vv-name="major_id"
                      data-vv-as="major"
                      name="major_id"
                      required=""
                      clearable=""
                      outline=""
                      hint="Please choose the study program and department first"
                      data-vv-value-path="editedStudent.major_id"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row="" wrap="">
                  <v-flex xs12="" sm6="">
                    <v-autocomplete
                      v-model="editedStudent.group_id"
                      v-validate="'required'"
                      :error-messages="errors.collect('group_id')"
                      :disabled="isLoading"
                      :items="groups"
                      item-value="id"
                      item-text="name"
                      label="Group"
                      data-vv-name="group_id"
                      data-vv-as="Group"
                      name="group_id"
                      required=""
                      clearable=""
                      outline=""
                      data-vv-value-path="editedStudent.group_id"
                    />
                  </v-flex>
                  <v-flex xs12="" sm6="">
                    <v-autocomplete
                      v-model="editedStudent.grade"
                      v-validate="'required'"
                      :error-messages="errors.collect('grade')"
                      :disabled="isLoading"
                      :items="grades"
                      item-text="name"
                      item-value="id"
                      label="Grade"
                      data-vv-name="grade"
                      data-vv-as="grade"
                      name="grade"
                      required=""
                      clearable=""
                      outline=""
                      hint="Please choose the study program first"
                      data-vv-value-path="editedStudent.grade"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row="" wrap="">
                  <v-flex xs12="">
                    <v-switch
                      v-model="editedStudent.is_active"
                      class="ma-0"
                      label="Is student active?"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row="" wrap="">
                  <v-flex xs12="" class="text-xs-center">
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
                              fill-height=""
                              style="background-color: rgba(0, 0, 0, .5)"
                            >
                              <v-layout
                                fill-height=""
                                align-center=""
                                justify-center=""
                              >
                                <v-btn
                                  :disabled="isLoading"
                                  :loading="isLoading"
                                  color="error"
                                  @click="onRemoveImage"
                                >
                                  Remove
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
                      ref="avatarImage"
                      style="display: none"
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
                  type="submit"
                  @click="onCreateOrEdit"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </form>
        </v-flex>
        <v-flex xs12="" md8="">
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
                    <v-flex xs12="" md6="">
                      <video
                        id="live-video"
                        ref="liveVideo"
                        width="720"
                        height="540"
                        autoplay=""
                      />
                    </v-flex>
                    <v-flex xs12="" md6="">
                      <canvas
                        id="live-canvas"
                        ref="liveCanvas"
                        width="720"
                        height="540"
                      />
                    </v-flex>
                  </v-layout>
                  <v-layout row="" wrap="">
                    <v-flex xs12="" md6="">
                      <v-select
                        v-model="selectedCamera"
                        :items="cameras"
                        label="Select Camera"
                        outline=""
                        item-value="deviceId"
                        item-text="label"
                      />
                    </v-flex>
                    <v-flex xs12="" md6="">
                      <v-tooltip bottom="">
                        <template #activator="{ on }">
                          <v-btn
                            v-long-press="300"
                            color="accent"
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
                        color="error"
                        @click="onResetPhoto"
                      >
                        Reset
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-tab-item>
                <v-tab-item value="file-upload">
                  <v-layout row="" wrap="">
                    <v-flex xs12="" md6="">
                      <v-img
                        src="/examples/images/tony-stark.jpg"
                        :aspect-ratio="456 / 400"
                        class="mb-3"
                      >
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
                    </v-flex>
                    <v-flex xs12="" md6="">
                      <v-img
                        src="/examples/images/iron-man.jpg"
                        :aspect-ratio="456 / 400"
                        class="mb-3"
                      >
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
                      <h2 class="headline error--text">Bad</h2>
                      <ol class="body-2">
                        <li>Face isn't clearly visible</li>
                        <li>
                          Face is covered with glasses, masks or other objects
                          that can cover
                        </li>
                      </ol>
                    </v-flex>
                  </v-layout>
                  <v-layout row="" wrap="">
                    <v-flex xs12="">
                      <input
                        ref="images"
                        style="display: none"
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
                    </v-flex>
                  </v-layout>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row="" wrap="">
        <v-flex xs12="">
          <v-card>
            <v-toolbar card="">
              <v-toolbar-title>Photos</v-toolbar-title>
              <v-spacer />
              <v-fade-transition>
                <v-btn
                  v-if="removingImages.length > 0"
                  color="error"
                  @click="isRemoving = true"
                >
                  Remove {{ pluralize('image', removingImages.length, true) }}
                </v-btn>
              </v-fade-transition>
              <v-btn color="accent" @click="onSelectAllImages">
                {{ isAllImagesSelected ? 'Unselect All' : 'Select All' }}
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-container grid-list-xl="" fluid="">
                <v-data-iterator
                  :items="studentImages"
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
                      <v-flex xs12="" sm6="" md4="" d-flex="">
                        <v-hover>
                          <template #default="{ hover }">
                            <v-card flat="" tile="" class="d-flex">
                              <v-img :src="item.path" :aspect-ratio="720 / 540">
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
                                <v-fade-transition>
                                  <v-container
                                    v-if="removingImages.includes(item.id)"
                                    fluid=""
                                    fill-height=""
                                    style="background-color: rgba(0, 0, 0, .5)"
                                  >
                                    <v-layout
                                      row=""
                                      wrap=""
                                      fill-height=""
                                      align-center=""
                                      justify-center=""
                                    >
                                      <v-btn
                                        :disabled="isLoading"
                                        :loading="isLoading"
                                        color="accent"
                                        @click="onTriggerSelecting(item.id)"
                                      >
                                        Unselect
                                      </v-btn>
                                    </v-layout>
                                  </v-container>
                                </v-fade-transition>
                                <v-fade-transition>
                                  <v-container
                                    v-if="hover"
                                    fluid=""
                                    fill-height=""
                                    style="background-color: rgba(0, 0, 0, .5)"
                                  >
                                    <v-layout
                                      row=""
                                      wrap=""
                                      fill-height=""
                                      align-center=""
                                      justify-center=""
                                    >
                                      <v-btn
                                        :disabled="isLoading"
                                        :loading="isLoading"
                                        color="primary"
                                        @click="onUseAsAvatar(item.path)"
                                      >
                                        Use as Avatar
                                      </v-btn>
                                      <v-btn
                                        :disabled="isLoading"
                                        :loading="isLoading"
                                        color="accent"
                                        @click="onTriggerSelecting(item.id)"
                                      >
                                        Select
                                      </v-btn>
                                    </v-layout>
                                  </v-container>
                                </v-fade-transition>
                              </v-img>
                            </v-card>
                          </template>
                        </v-hover>
                      </v-flex>
                    </v-fade-transition>
                  </template>
                </v-data-iterator>
              </v-container>
              <v-tooltip left="">
                <template #activator="{ on }">
                  <v-fade-transition>
                    <v-btn
                      v-if="removingImages.length > 0"
                      color="error"
                      icon=""
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
        </v-flex>
      </v-layout>
      <v-dialog v-model="isRemoving" width="350" @input="onCloseRemoving">
        <v-card>
          <v-card-text>
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
              flat=""
              @click="onCloseRemoving"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="error"
              flat=""
              @click="onRemoveTrainingImage(removingImages)"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
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
  head() {
    return {
      title: `Edit Student - ${this.student.name}`
    }
  },
  mixins: [string],
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
        descending: true,
        page: 1,
        rowsPerPage: 12,
        sortBy: 'created_at',
        totalItems: 12
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
    'avatarImage.file': async function(file) {
      await this.onCreateOrEdit(null, {
        ...this.editedStudent,
        image: file
      })
    },
    // eslint-disable-next-line
    'editedStudent.study_program_id': function(study_program_id) {
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
      handler({ descending, page, rowsPerPage, sortBy }) {
        if (descending) {
          sortBy = `-${sortBy}`
        }
        this.fetchImages({
          orderBy: sortBy,
          limit: rowsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * rowsPerPage
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
      await this.initCamera(this.selectedCamera)
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
      try {
        const videoStream = await this.startCamera(deviceId)
        this.$refs.liveVideo.srcObject = videoStream
      } catch (error) {
        this.$handleError(error)
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
        orderBy = '-created_at',
        limit = this.pagination.rowsPerPage,
        offset = (this.pagination.page - 1) * this.pagination.rowsPerPage
      } = {
        orderBy: '-created_at',
        limit: this.pagination.rowsPerPage,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage
      }
    ) {
      try {
        this.isLoading = true
        const { id } = this.$route.params
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
      const descriptor = await this.getFaceDescriptors({ image })
      if (descriptor) {
        await this.$api.studentDescriptors.create({
          studentDescriptor: { student_image_id: image.id, descriptor }
        })
        await this.$api.studentImages.update(image.id, {
          studentImage: { has_descriptor: true }
        })
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
          filesArray.forEach(file => {
            payload.append('images', file)
          })
          const { studentImages } = await this.$api.studentImages.create(
            payload,
            {
              student_id: id
            }
          )
          await Promise.all(
            studentImages.map(image => this.computeImageDescriptors(image))
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
          imageId => imageId === id
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
            removingImages.map(id => this.$api.studentImages.destroy(id))
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
        const valid = await this.$validator.validate()
        if (valid) {
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
            this.$validator.reset(),
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
  }
}
</script>
