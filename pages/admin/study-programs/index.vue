<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Study Programs</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="accent" @click="fetchStudyPrograms">
        Refresh
      </v-btn>
      <v-btn color="primary" @click="onTrigger">
        Create Study Program
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="studyPrograms"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="isLoading"
      >
        <template #items="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1 body-2">{{ item.name }}</td>
            <td class="py-1 body-2 text-xs-center">
              <v-btn color="primary" @click="onTrigger($event, item)">
                Edit
              </v-btn>
              <v-btn color="error" @click="onTriggerRemoving(item)">
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
        lazy=""
        @input="onClose"
      >
        <v-card>
          <v-toolbar color="primary" dark="" card="">
            <v-toolbar-title>
              <h3 class="title">
                {{ isEditing ? 'Edit' : 'Create' }} Study Program
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onClose">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-container class="pa-0" fluid="" grid-list-xl="">
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <v-text-field
                    v-model="studyProgram.name"
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
                    data-vv-value-path="studyProgram.name"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              flat=""
              @click="onClose"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="primary"
              flat=""
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
        lazy=""
        @input="onCloseRemoving"
      >
        <v-card>
          <v-toolbar color="primary" dark="" card="">
            <v-toolbar-title>
              <h3 class="title">
                Delete Confirmation
              </h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onCloseRemoving">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <div class="body-2">
              Are you sure you want to remove {{ studyProgram.name }}?
            </div>
          </v-card-text>
          <v-divider />
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
              @click="onRemove(studyProgram)"
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
import cloneDeep from 'lodash/fp/cloneDeep'

export default {
  head() {
    return {
      title: 'Study Programs'
    }
  },
  data() {
    return {
      isCreatingOrEditingDialog: false,
      isEditing: false,
      isRemovingDialog: false,
      default: {
        id: null,
        name: null
      },
      studyProgram: {
        id: null,
        name: null
      },
      studyPrograms: [],
      filter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: ''
      },
      isLoading: false,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Action', align: 'center', sortable: false }
      ],
      rowsPerPageItems: [25, 50, 75, 100],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 25,
        sortBy: 'name',
        totalItems: 25
      },
      totalItems: 0
    }
  },
  watch: {
    pagination: {
      handler({ descending, page, rowsPerPage, sortBy }) {
        if (sortBy) {
          if (sortBy.includes('.name')) {
            sortBy = `${sortBy.replace('.name', '')}_id`
          }
        }
        if (descending) {
          sortBy = `-${sortBy}`
        }
        this.fetchStudyPrograms({
          orderBy: sortBy,
          limit: rowsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * rowsPerPage
        })
      },
      deep: true
    }
  },
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const {
        rowCount,
        studyPrograms,
        ...filter
      } = await $api.studyPrograms.fetchPage({
        orderBy: 'name',
        limit: 25,
        offset: 0
      })
      return {
        filter,
        studyPrograms,
        totalItems: rowCount
      }
    } catch ({ response }) {
      $handleError(response)
    }
  },
  methods: {
    async fetchStudyPrograms(
      {
        orderBy = this.pagination.sortBy,
        limit = this.pagination.rowsPerPage, // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset = (this.pagination.page - 1) * this.pagination.rowsPerPage,
        descending = this.pagination.descending
      } = {
        orderBy: this.pagination.sortBy,
        limit: this.pagination.rowsPerPage,
        // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        descending: this.pagination.descending
      }
    ) {
      try {
        this.isLoading = true
        if (orderBy) {
          if (orderBy.includes('.name')) {
            orderBy = `${orderBy.replace('.name', '')}_id`
          }
        }
        if (descending) {
          orderBy = `-${orderBy}`
        }
        const {
          rowCount,
          studyPrograms,
          ...filter
        } = await this.$api.studyPrograms.fetchPage({
          orderBy,
          limit,
          offset
        })
        this.filter = filter
        this.totalItems = rowCount
        this.studyPrograms = studyPrograms
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
        this.studyProgram = { ...item }
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false
      this.$validator.reset()
      this.studyProgram = { ...this.default }
    },
    async onCreateOrEdit(
      event,
      { _payload = this.studyProgram, isEditing = false } = {
        _payload: this.studyProgram,
        isEditing: false
      }
    ) {
      try {
        const valid = await this.$validator.validate()
        if (valid) {
          this.isLoading = true

          let payload = cloneDeep(_payload)
          delete payload.id

          payload = {
            studyProgram: payload
          }

          if (this.isEditing) {
            Object.assign(payload.studyProgram, {
              updated_at: new Date().toISOString()
            })
            await this.$api.studyPrograms.update(_payload.id, payload)
            this.$notify({
              kind: 'success',
              message: 'Study Program is updated successfully'
            })
          } else {
            await this.$api.studyPrograms.create(payload)
            await this.$notify({
              kind: 'success',
              message: 'Study Program is created successfully'
            })
          }

          await Promise.all([this.onClose(), this.fetchStudyPrograms()])
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
      this.studyProgram = { ...item }
    },
    onCloseRemoving() {
      this.isRemovingDialog = false
      this.$validator.reset()
      this.studyProgram = { ...this.default }
    },
    async onRemove(item) {
      try {
        this.isLoading = true

        await this.$api.studyPrograms.destroy(item.id)
        await Promise.all([
          this.fetchStudyPrograms(),
          this.onCloseRemoving(),
          this.$notify({
            kind: 'success',
            message: 'Study Program is deleted successfully'
          })
        ])
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
