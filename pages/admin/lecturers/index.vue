<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Lecturers</h2>
      </v-toolbar-title>
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
            <td class="py-1 body-2">{{ item.identifier }}</td>
            <td class="py-1 body-2">{{ item.name }}</td>
            <td class="py-1 text-xs-center">
              <v-btn
                color="primary"
                nuxt=""
                exact=""
                :to="{ name: 'admin-lecturers-id', params: { id: item.id } }"
              >
                Edit
              </v-btn>
              <v-btn color="error">Delete</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import AppAvatar from '~/components/AppAvatar'
import string from '~/mixins/string'

export default {
  components: {
    AppAvatar
  },
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
          limit: 20,
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
    async fetchLecturers({ orderBy = 'name', limit = 20, offset = 0 }) {
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
