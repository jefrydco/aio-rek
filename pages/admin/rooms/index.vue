<template>
  <v-card>
    <v-app-bar flat="">
      <v-toolbar-title>
        <h2 class="headline">Rooms</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="aio-refresh ma-1" color="accent" @click="fetchRooms">
        Refresh
      </v-btn>
      <v-btn class="aio-create ma-1" color="primary" @click="onTrigger">
        Create Room
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="rooms"
        :footer-props="{
          'items-per-page-options': rowsPerPageItems
        }"
        :options.sync="pagination"
        :server-items-length="totalItems"
        :loading="isLoading"
      >
        <template #item="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1 body-2">
              {{ item.name }}
            </td>
            <td class="py-1 body-2 text-center">
              <v-chip v-if="item.in_use" color="error" text-color="white">
                <v-avatar left="" class="error darken-3">
                  <v-icon>close</v-icon>
                </v-avatar>
                <span>Used</span>
              </v-chip>
              <v-chip v-else="" color="info" text-color="white">
                <v-avatar left="" class="blue darken-3">
                  <v-icon>check</v-icon>
                </v-avatar>
                <span>Not used</span>
              </v-chip>
            </td>
            <td class="py-1 body-2 text-center">
              <v-btn
                :class="`aio-edit-${kebabCase(item.name)}`"
                class="ma-1"
                color="primary"
                @click="onTrigger($event, item)"
              >
                Edit
              </v-btn>
              <v-btn
                :class="`aio-delete-${kebabCase(item.name)}`"
                class="ma-1"
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
        @input="onClose"
      >
        <v-card>
          <v-app-bar color="primary" dark="" flat="">
            <v-toolbar-title>
              <h3 class="title">{{ isEditing ? 'Edit' : 'Create' }} Room</h3>
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
                      name="Room"
                      rules="required"
                    >
                      <v-text-field
                        v-model="room.name"
                        :error-messages="errors"
                        :disabled="isLoading"
                        label="Name"
                        name="name"
                        required=""
                        clearable=""
                        outlined=""
                        autofocus=""
                        hint="Name must be unique"
                      />
                    </validation-provider>
                  </validation-observer>
                </v-col>
              </v-row>
              <v-row class="flex-wrap">
                <v-col cols="12">
                  <v-switch v-model="room.in_use" label="Is room in use?" />
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
              <h3 class="title">Delete Confirmation</h3>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon="" @click="onCloseRemoving">
              <v-icon>close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text class="pt-5">
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
import { validate } from 'vee-validate'
import copy from 'clipboard-copy'
import cloneDeep from 'lodash/fp/cloneDeep'
import string from '~/mixins/string'

export default {
  mixins: [string],
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
        this.fetchRooms({
          orderBy: sortBy,
          limit: itemsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * itemsPerPage
        })
      },
      deep: true
    }
  },
  methods: {
    async fetchRooms(
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
        const valids = await Promise.all(
          Object.keys(this.room)
            .filter((i) => i !== 'id')
            .map((i) => validate(this.room[i], 'required'))
        )
        if (valids.every(({ valid }) => valid)) {
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
  },
  head() {
    return {
      title: 'Rooms'
    }
  }
}
</script>
