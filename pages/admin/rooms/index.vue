<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Rooms</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="aio-refresh" color="accent" @click="fetchRooms">
        Refresh
      </v-btn>
      <v-btn class="aio-create" color="primary" @click="onTrigger">
        Create Room
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="rooms"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="isLoading"
      >
        <template #items="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1 body-2">
              {{ item.name }}
            </td>
            <td class="py-1 body-2 text-xs-center">
              <v-chip v-if="item.in_use" color="error" text-color="white">
                <v-avatar class="error darken-3">
                  <v-icon>close</v-icon>
                </v-avatar>
                <span>Used</span>
              </v-chip>
              <v-chip v-else="" color="info" text-color="white">
                <v-avatar class="blue darken-3">
                  <v-icon>check</v-icon>
                </v-avatar>
                <span>Not used</span>
              </v-chip>
            </td>
            <td class="py-1 body-2 text-xs-center">
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
              <h3 class="title">{{ isEditing ? 'Edit' : 'Create' }} Room</h3>
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
                    v-model="room.name"
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
                    data-vv-value-path="room.name"
                    hint="Name must be unique"
                  />
                </v-flex>
              </v-layout>
              <v-layout row="" wrap="">
                <v-flex xs12="">
                  <v-switch v-model="room.in_use" label="Is room in use?" />
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
              Are you sure you want to remove {{ room.name }}?
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
              @click="onRemove(room)"
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
import copy from 'clipboard-copy'
import cloneDeep from 'lodash/fp/cloneDeep'
import string from '~/mixins/string'

export default {
  head() {
    return {
      title: 'Rooms'
    }
  },
  mixins: [string],
  data() {
    return {
      isCreatingOrEditingDialog: false,
      isEditing: false,
      isRemovingDialog: false,
      default: {
        id: null,
        name: null,
        in_use: false
      },
      room: {
        id: null,
        name: null,
        in_use: false
      },
      rooms: [],
      filter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: ''
      },
      isLoading: false,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'In use?', value: 'is_active', align: 'center' },
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
        this.fetchRooms({
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
      const { rowCount, rooms, ...filter } = await $api.rooms.fetchPage({
        orderBy: 'name',
        limit: 25,
        offset: 0
      })
      return {
        filter,
        rooms,
        totalItems: rowCount
      }
    } catch ({ response }) {
      $handleError(response)
    }
  },
  methods: {
    async fetchRooms(
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
        const { rowCount, rooms, ...filter } = await this.$api.rooms.fetchPage({
          orderBy,
          limit,
          offset
        })
        this.filter = filter
        this.totalItems = rowCount
        this.rooms = rooms
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
        this.room = { ...item }
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false
      this.$validator.reset()
      this.room = { ...this.default }
    },
    async onCreateOrEdit(
      event,
      { _payload = this.room, isEditing = false } = {
        _payload: this.room,
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
            room: payload
          }

          if (this.isEditing) {
            Object.assign(payload.room, {
              updated_at: new Date().toISOString()
            })
            await this.$api.rooms.update(_payload.id, payload)
            await this.$notify({
              kind: 'success',
              message: 'Room is updated successfully'
            })
          } else {
            await this.$api.rooms.create(payload)
            await this.$notify({
              kind: 'success',
              message: 'Room is created successfully'
            })
          }

          await Promise.all([this.onClose(), this.fetchRooms()])
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
      this.room = { ...item }
    },
    onCloseRemoving() {
      this.isRemovingDialog = false
      this.$validator.reset()
      this.room = { ...this.default }
    },
    async onRemove(item) {
      try {
        this.isLoading = true

        await this.$api.rooms.destroy(item.id)
        await Promise.all([
          this.fetchRooms(),
          this.onCloseRemoving(),
          this.$notify({
            kind: 'success',
            message: 'Room is deleted successfully'
          })
        ])
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async onCopy(label, text) {
      try {
        await copy(text)
        await this.$notify({
          kind: 'success',
          message: `${label} is copied successfully`
        })
      } catch (error) {
        this.$handleError(error)
      }
    }
  }
}
</script>
