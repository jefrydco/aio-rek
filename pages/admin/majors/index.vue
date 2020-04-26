<template>
  <v-card>
    <v-app-bar flat="">
      <v-toolbar-title>
        <h2 class="headline">Majors</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="aio-refresh ma-1" color="accent" @click="fetchMajors">
        Refresh
      </v-btn>
      <v-btn class="aio-create ma-1" color="primary" @click="onTrigger">
        Create Major
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="majors"
        :footer-props="{
          'items-per-page-options': rowsPerPageItems
        }"
        :options.sync="pagination"
        :server-items-length="totalItems"
        :loading="isLoading"
      >
        <template #item="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1 body-2">{{ item.name }}</td>
            <td class="py-1 body-2">{{ item.department.name }}</td>
            <td class="py-1 body-2 text-center">
              <v-btn
                :class="`aio-edit-${kebabCase(item.name)}`"
                color="primary"
                class="ma-1"
                @click="onTrigger($event, item)"
              >
                Edit
              </v-btn>
              <v-btn
                :class="`aio-delete-${kebabCase(item.name)}`"
                color="error"
                class="ma-1"
                @click="onTriggerRemoving(item)"
              >
                Delete
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog
        v-model="isCreatingOrEditingDialog"
        scrollable=""
        width="350"
        @input="onClose"
      >
        <v-card>
          <v-app-bar color="primary" dark="" flat="">
            <v-toolbar-title>
              <h3 class="title">{{ isEditing ? 'Edit' : 'Create' }} Major</h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onClose">
              <v-icon>close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text class="pt-5">
            <v-container class="pa-0" fluid="">
              <v-row class="flex-wrap">
                <v-col cols="12">
                  <validation-observer>
                    <validation-provider
                      #default="{ errors }"
                      name="Name"
                      rules="required"
                    >
                      <v-text-field
                        v-model="major.name"
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
                      name="Department"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="major.department_id"
                        :error-messages="errors"
                        :disabled="isLoading"
                        :items="departments"
                        item-value="id"
                        item-text="name"
                        label="Department"
                        name="department_id"
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
                        v-model="major.study_program_id"
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
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              text=""
              class="aio-cancel-edit-save"
              @click="onClose"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="primary"
              text=""
              class="aio-edit-save"
              @click="onCreateOrEdit"
            >
              {{ isEditing ? 'Edit' : 'Save' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isRemovingDialog"
        width="350"
        scrollable=""
        @input="onCloseRemoving"
      >
        <v-card>
          <v-app-bar color="primary" dark="" flat="">
            <v-toolbar-title>
              <h3 class="title">
                Delete Confirmation
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onCloseRemoving">
              <v-icon>close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text class="pt-5">
            <div class="body-2">
              Are you sure you want to remove {{ major.name }}?
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              text=""
              class="aio-cancel-delete"
              @click="onCloseRemoving"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="error"
              text=""
              class="aio-remove"
              @click="onRemove(major)"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import { validate } from 'vee-validate'
import cloneDeep from 'lodash/fp/cloneDeep'
import string from '~/mixins/string'

export default {
  mixins: [string],
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const [
        { rowCount, majors, ...filter },
        { departments },
        { studyPrograms }
      ] = await Promise.all([
        $api.majors.fetchPage({
          orderBy: 'name',
          limit: 25,
          offset: 0,
          withRelated: 'department'
        }),
        $api.departments.fetchPage({ limit: -1 }),
        $api.studyPrograms.fetchPage({ limit: -1 })
      ])
      return {
        filter,
        majors,
        totalItems: rowCount,
        departments,
        studyPrograms
      }
    } catch ({ response }) {
      $handleError(response)
    }
  },
  data() {
    return {
      departments: [],
      studyPrograms: [],
      isCreatingOrEditingDialog: false,
      isEditing: false,
      isRemovingDialog: false,
      default: {
        id: null,
        name: null,
        department_id: null,
        study_program_id: null
      },
      major: {
        id: null,
        name: null,
        department_id: null,
        study_program_id: null
      },
      majors: [],
      filter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: ''
      },
      isLoading: false,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Department', value: 'department.name' },
        { text: 'Action', align: 'center', sortable: false }
      ],
      rowsPerPageItems: [25, 50, 75, 100],
      pagination: {
        sortDesc: [false],
        page: 1,
        itemsPerPage: 25,
        sortBy: ['name']
      },
      totalItems: 0
    }
  },
  watch: {
    pagination: {
      handler({ sortDesc, page, itemsPerPage, sortBy }) {
        this.fetchMajors({
          orderBy: sortBy,
          limit: itemsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * itemsPerPage,
          withRelated: 'department',
          sortDesc
        })
      },
      deep: true
    }
  },
  methods: {
    async fetchMajors(
      {
        orderBy = this.pagination.sortBy,
        limit = this.pagination.itemsPerPage, // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset = (this.pagination.page - 1) * this.pagination.itemsPerPage,
        sortDesc = this.pagination.sortDesc
      } = {
        orderBy: this.pagination.sortBy,
        limit: this.pagination.itemsPerPage,
        // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset: (this.pagination.page - 1) * this.pagination.itemsPerPage,
        sortDesc: this.pagination.sortDesc
      }
    ) {
      try {
        this.isLoading = true
        orderBy = orderBy[0]
        if (orderBy) {
          if (orderBy.includes('.name')) {
            orderBy = `${orderBy.replace('.name', '')}_id`
          }
        }
        if (sortDesc[0]) {
          orderBy = `-${orderBy}`
        }

        const {
          rowCount,
          majors,
          ...filter
        } = await this.$api.majors.fetchPage({
          orderBy,
          limit,
          offset,
          withRelated: 'department'
        })
        this.filter = filter
        this.totalItems = rowCount
        this.majors = majors
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
    onTrigger(event, item) {
      this.isCreatingOrEditingDialog = true
      if (item) {
        this.isEditing = true
        this.major = { ...item }
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false

      this.major = { ...this.default }
    },
    async onCreateOrEdit(
      event,
      { _payload = this.major, isEditing = false } = {
        _payload: this.major,
        isEditing: false
      }
    ) {
      try {
        const valids = await Promise.all(
          Object.keys(this.major)
            .filter((i) => i !== 'id')
            .map((i) => validate(this.major[i], 'required'))
        )
        if (valids.every(({ valid }) => valid)) {
          this.isLoading = true

          let payload = cloneDeep(_payload)
          delete payload.id
          delete payload.department

          payload = {
            major: payload
          }

          if (this.isEditing) {
            Object.assign(payload.major, {
              updated_at: new Date().toISOString()
            })
            await this.$api.majors.update(_payload.id, payload)
            await this.$notify({
              kind: 'success',
              message: 'Major is updated successfully'
            })
          } else {
            await this.$api.majors.create(payload)
            await this.$notify({
              kind: 'success',
              message: 'Major is created successfully'
            })
          }

          await Promise.all([this.onClose(), this.fetchMajors()])
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
    },
    onTriggerRemoving(item) {
      this.isRemovingDialog = true
      this.major = { ...item }
    },
    onCloseRemoving() {
      this.isRemovingDialog = false

      this.major = { ...this.default }
    },
    async onRemove(item) {
      try {
        this.isLoading = true

        await this.$api.majors.destroy(item.id)
        await Promise.all([
          this.fetchMajors(),
          this.onCloseRemoving(),
          this.$notify({
            kind: 'success',
            message: 'Major is deleted successfully'
          })
        ])
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    }
  },
  head() {
    return {
      title: 'Majors'
    }
  }
}
</script>
