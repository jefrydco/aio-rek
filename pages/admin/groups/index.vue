<template>
  <v-card>
    <v-app-bar flat="">
      <v-toolbar-title>
        <h2 class="headline">Groups</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="aio-refresh ma-1" color="accent" @click="fetchGroups">
        Refresh
      </v-btn>
      <v-btn class="aio-create ma-1" color="primary" @click="onTrigger">
        Create Group
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="groups"
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
              <h3 class="title">{{ isEditing ? 'Edit' : 'Create' }} Group</h3>
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
                        v-model="group.name"
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
              Are you sure you want to remove {{ group.name }}?
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
import { validate } from 'vee-validate'
import cloneDeep from 'lodash/fp/cloneDeep'
import string from '~/mixins/string'

export default {
  mixins: [string],
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const { rowCount, groups, ...filter } = await $api.groups.fetchPage({
        orderBy: 'name',
        limit: 25,
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
        this.fetchGroups({
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
    async fetchGroups(
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
        this.group = { ...item }
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false

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
        const valids = await Promise.all(
          Object.keys(this.group)
            .filter((i) => i !== 'id')
            .map((i) => validate(this.group[i], 'required'))
        )
        if (valids.every(({ valid }) => valid)) {
          this.isLoading = true

          let payload = cloneDeep(_payload)
          delete payload.id

          payload = {
            group: payload
          }

          if (this.isEditing) {
            Object.assign(payload.group, {
              updated_at: new Date().toISOString()
            })
            await this.$api.groups.update(_payload.id, payload)
            this.$notify({
              kind: 'success',
              message: 'Group is updated successfully'
            })
          } else {
            await this.$api.groups.create(payload)
            await this.$notify({
              kind: 'success',
              message: 'Group is created successfully'
            })
          }

          await Promise.all([this.onClose(), this.fetchGroups()])
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
  },
  head() {
    return {
      title: 'Groups'
    }
  }
}
</script>
