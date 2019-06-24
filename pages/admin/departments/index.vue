<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Departments</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="onTrigger">
        Create Department
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="departments"
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
        @input="onClose"
      >
        <v-card>
          <v-card-text>
            <v-layout row="" wrap="">
              <v-flex xs12="">
                <v-text-field
                  v-model="department.name"
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
                  data-vv-value-path="department.name"
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
              color="primary"
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
              Are you sure you want to remove {{ department.name }}?
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
              @click="onRemove(department)"
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
      title: 'Departments'
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
      department: {
        id: null,
        name: null
      },
      departments: [],
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
        this.fetchDepartments({
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
        departments,
        ...filter
      } = await $api.departments.fetchPage({
        orderBy: 'name',
        limit: 25,
        offset: 0
      })
      return {
        filter,
        departments,
        totalItems: rowCount
      }
    } catch ({ response }) {
      $handleError(response)
    }
  },
  methods: {
    async fetchDepartments(
      {
        orderBy = 'name',
        limit = 25, // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset = (this.pagination.page - 1) * this.pagination.rowsPerPage
      } = {
        orderBy: 'name',
        limit: 25,
        // Taken from: https://stackoverflow.com/a/3521002/7711812
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage
      }
    ) {
      try {
        this.isLoading = true
        const {
          rowCount,
          departments,
          ...filter
        } = await this.$api.departments.fetchPage({
          orderBy,
          limit,
          offset
        })
        this.filter = filter
        this.totalItems = rowCount
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
        this.department = { ...item }
      }
    },
    onClose() {
      this.isCreatingOrEditingDialog = false
      this.isEditing = false
      this.$validator.reset()
      this.department = { ...this.default }
    },
    async onCreateOrEdit(
      event,
      { _payload = this.department, isEditing = false } = {
        _payload: this.department,
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
            department: payload
          }

          if (this.isEditing) {
            Object.assign(payload.department, {
              updated_at: new Date().toISOString()
            })
            await this.$api.departments.update(_payload.id, payload)
            await this.$notify({
              kind: 'success',
              message: `Department is updated successfully`
            })
          } else {
            await this.$api.departments.create(payload)
            await this.$notify({
              kind: 'success',
              message: `Department is created successfully`
            })
          }

          await Promise.all([this.onClose(), this.fetchDepartments()])
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
      this.department = { ...item }
    },
    onCloseRemoving() {
      this.isRemovingDialog = false
      this.$validator.reset()
      this.department = { ...this.default }
    },
    async onRemove(item) {
      try {
        this.isLoading = true

        await this.$api.departments.destroy(item.id)
        await Promise.all([
          this.fetchDepartments(),
          this.onCloseRemoving(),
          this.$notify({
            kind: 'success',
            message: 'Department is deleted successfully'
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
