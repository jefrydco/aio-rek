<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Subjects</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="aio-refresh" color="accent" @click="fetchSubjects">
        Refresh
      </v-btn>
      <v-btn class="aio-create" color="primary" @click="onTrigger">
        Create Subject
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="subjects"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="isLoading"
      >
        <template #items="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1 body-2">
              {{ item.identifier }}
            </td>
            <td class="py-1 body-2">
              {{ item.name }}
            </td>
            <td class="py-1 body-2 text-center">
              <v-btn
                :class="`aio-edit-${kebabCase(item.name)}`"
                color="primary"
                @click="onTrigger($event, item)"
              >
                Edit
              </v-btn>
              <v-btn
                :class="`aio-delete-${kebabCase(item.name)}`"
                color="error"
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
        lazy=""
        @input="onClose"
      >
        <v-card>
          <v-toolbar color="primary" dark="" card="">
            <v-toolbar-title>
              <h3 class="title">{{ isEditing ? 'Edit' : 'Create' }} Subject</h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onClose">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-container class="pa-0" fluid="" grid-list-xl="">
              <v-layout wrap="">
                <v-flex xs12="">
                  <v-text-field
                    v-model="subject.identifier"
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
                    autofocus=""
                    hint="Identifier must be unique"
                    data-vv-value-path="subject.identifier"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap="">
                <v-flex xs12="">
                  <v-text-field
                    v-model="subject.name"
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
                    hint="Name must be unique"
                    data-vv-value-path="subject.name"
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
              class="aio-cancel-edit-save"
              @click="onClose"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="primary"
              flat=""
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
              Are you sure you want to remove {{ subject.name }}?
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              flat=""
              class="aio-cancel-delete"
              @click="onCloseRemoving"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              color="error"
              flat=""
              class="aio-remove"
              @click="onRemove(subject)"
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
import string from '~/mixins/string'

export default {
  mixins: [string],
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const { rowCount, subjects, ...filter } = await $api.subjects.fetchPage({
        orderBy: 'name',
        limit: 25,
        offset: 0
      })
      return {
        filter,
        subjects,
        totalItems: rowCount
      }
    } catch ({ response }) {
      $handleError(response)
    }
  },
  data() {
    return {
      isCreatingOrEditingDialog: false,
      isEditing: false,
      isRemovingDialog: false,
      default: {
        id: null,
        name: null,
        identifier: null
      },
      subject: {
        id: null,
        name: null,
        identifier: null
      },
      subjects: [],
      filter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: ''
      },
      isLoading: false,
      headers: [
        { text: 'Identifier', value: 'identifier' },
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
        this.fetchSubjects({
          orderBy: sortBy,
          limit: rowsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * rowsPerPage
        })
      },
      deep: true
    }
  },
  methods: {
    async fetchSubjects(
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
          subjects,
          ...filter
        } = await this.$api.subjects.fetchPage({
          orderBy,
          limit,
          offset
        })
        this.filter = filter
        this.totalItems = rowCount
        this.subjects = subjects
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
        this.subject = { ...item }
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false
      this.$validator.reset()
      this.subject = { ...this.default }
    },
    async onCreateOrEdit(
      event,
      { _payload = this.subject, isEditing = false } = {
        _payload: this.subject,
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
            subject: payload
          }

          if (this.isEditing) {
            Object.assign(payload.subject, {
              updated_at: new Date().toISOString()
            })
            await this.$api.subjects.update(_payload.id, payload)
            await this.$notify({
              kind: 'success',
              message: 'Subject is updated successfully'
            })
          } else {
            await this.$api.subjects.create(payload)
            await this.$notify({
              kind: 'success',
              message: 'Subject is created successfully'
            })
          }

          await Promise.all([this.onClose(), this.fetchSubjects()])
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
      this.subject = { ...item }
    },
    onCloseRemoving() {
      this.isRemovingDialog = false
      this.$validator.reset()
      this.subject = { ...this.default }
    },
    async onRemove(item) {
      try {
        this.isLoading = true

        await this.$api.subjects.destroy(item.id)
        await Promise.all([
          this.fetchSubjects(),
          this.onCloseRemoving(),
          this.$notify({
            kind: 'success',
            message: 'Subject is deleted successfully'
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
      title: 'Subjects'
    }
  }
}
</script>
