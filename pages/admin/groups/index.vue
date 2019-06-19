<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Groups</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="onTrigger">
        Create Group
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="groups"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="isLoading"
      >
        <template #items="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1 body-2">{{ item.name }}</td>
            <td class="py-1 text-xs-center">
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
        @input="onClose"
      >
        <v-card>
          <v-card-text>
            <v-layout row="" wrap="">
              <v-flex xs12="">
                <v-text-field
                  v-model="group.name"
                  v-validate="'required'"
                  :error-messages="errors.collect('name')"
                  :disabled="isLoading"
                  label="Name"
                  data-vv-name="name"
                  data-vv-as="name"
                  name="name"
                  required=""
                  clearable=""
                  box=""
                  autofocus=""
                  data-vv-value-path="group.name"
                />
              </v-flex>
            </v-layout>
          </v-card-text>
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
              color="error"
              flat=""
              @click="onCreateOrEdit"
            >
              {{ isEditing ? 'Edit' : 'Save' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isRemovingDialog" width="350" @input="onCloseRemoving">
        <v-card>
          <v-card-text>
            <div class="body-2">
              Are you sure you want to remove {{ group.name }}?
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
              @click="onRemove(group)"
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
import { cloneDeep } from 'lodash/fp'

export default {
  head() {
    return {
      title: 'Groups'
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
      group: {
        id: null,
        name: null
      },
      groups: [],
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
      rowsPerPageItems: [
        20,
        50,
        75,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20,
        sortBy: 'name',
        totalItems: 20
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
        this.fetchGroups({
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
      const { rowCount, groups, ...filter } = await $api.groups.fetchPage({
        orderBy: 'name',
        limit: 20,
        offset: 0
      })
      return {
        filter,
        groups,
        totalItems: rowCount
      }
    } catch ({ response }) {
      $handleError(response)
    }
  },
  methods: {
    async fetchGroups(
      { orderBy = 'name', limit = 20, offset = 0 } = {
        orderBy: 'name',
        limit: 20,
        offset: 0
      }
    ) {
      try {
        this.isLoading = true
        const {
          rowCount,
          groups,
          ...filter
        } = await this.$api.groups.fetchPage({
          orderBy,
          limit,
          offset
        })
        this.filter = filter
        this.totalItems = rowCount
        this.groups = groups
      } catch ({ response }) {
        this.$handleError(response)
      } finally {
        this.isLoading = false
      }
    },
    onTrigger(event, item) {
      this.isCreatingOrEditingDialog = true
      if (item) {
        this.isEditing = true
        this.group = { ...item }
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false
      this.$validator.reset()
      this.group = { ...this.default }
    },
    async onCreateOrEdit(
      event,
      { _payload = this.group, isEditing = false } = {
        _payload: this.group,
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
            group: payload
          }

          if (this.isEditing) {
            await this.$api.groups.update(_payload.id, payload)
          } else {
            await this.$api.groups.create(payload)
          }

          await Promise.all([
            this.onClose(),
            this.fetchGroups(),
            this.$notify({
              kind: 'success',
              message: 'Group is created successfully'
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
    },
    onTriggerRemoving(item) {
      this.isRemovingDialog = true
      this.group = { ...item }
    },
    onCloseRemoving() {
      this.isRemovingDialog = false
      this.$validator.reset()
      this.group = { ...this.default }
    },
    async onRemove(item) {
      try {
        this.isLoading = true

        await this.$api.groups.destroy(item.id)
        await Promise.all([
          this.fetchGroups(),
          this.onCloseRemoving(),
          this.$notify({
            kind: 'success',
            message: 'Group is deleted successfully'
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