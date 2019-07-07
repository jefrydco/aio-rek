<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Lecturers</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="aio-refresh" color="accent" @click="fetchLecturers">
        Refresh
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="lecturers"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="isLoading"
      >
        <template #items="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1">
              <app-avatar
                :name="removeTitle(item.name)"
                :image="item.image"
                text-class="caption"
              />
            </td>
            <td class="py-1 body-2">
              {{ item.identifier }}
            </td>
            <td class="py-1 body-2">
              {{ item.name }}
            </td>
            <td class="py-1 body-2 text-xs-center">
              <v-chip v-if="item.is_active" color="info" text-color="white">
                <v-avatar class="info darken-3">
                  <v-icon>check</v-icon>
                </v-avatar>
                <span>Active</span>
              </v-chip>
              <v-chip v-else="" color="error" text-color="white">
                <v-avatar class="error darken-3">
                  <v-icon>close</v-icon>
                </v-avatar>
                <span>Inactive</span>
              </v-chip>
            </td>
            <td class="py-1 body-2 text-xs-center">
              <v-btn
                color="primary"
                nuxt=""
                exact=""
                :class="`aio-edit-${kebabCase(item.name)}`"
                :to="{ name: 'admin-lecturers-id', params: { id: item.id } }"
              >
                Edit
              </v-btn>
              <v-btn
                :class="`aio-delete-${kebabCase(item.name)}`"
                color="error"
              >
                Delete
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import string from '~/mixins/string'

export default {
  head() {
    return {
      title: 'Lecturers'
    }
  },
  mixins: [string],
  data() {
    return {
      lecturers: [],
      filter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: ''
      },
      isLoading: false,
      headers: [
        { text: 'Image', value: 'image', sortable: false },
        { text: 'Identifier', value: 'name' },
        { text: 'Name', value: 'name' },
        { text: 'Is Active?', value: 'group.is_active', align: 'center' },
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
        this.fetchLecturers({
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
      const { rowCount, lecturers, ...filter } = await $api.lecturers.fetchPage(
        {
          orderBy: 'name',
          limit: 25,
          offset: 0
        }
      )
      return {
        filter,
        lecturers,
        totalItems: rowCount
      }
    } catch (error) {
      $handleError(error)
    }
  },
  methods: {
    async fetchLecturers(
      {
        orderBy = 'name',
        limit = 25,
        offset = (this.pagination.page - 1) * this.pagination.rowsPerPage
      } = {
        orderBy: 'name',
        limit: 25,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage
      }
    ) {
      try {
        this.isLoading = true
        const {
          rowCount,
          lecturers,
          ...filter
        } = await this.$api.lecturers.fetchPage({
          orderBy,
          limit,
          offset
        })
        this.filter = filter
        this.totalItems = rowCount
        this.lecturers = lecturers
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
