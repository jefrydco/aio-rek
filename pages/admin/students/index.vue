<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Students List</h2>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="students"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="isLoading"
      >
        <template #items="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1">
              <app-avatar
                :name="item.name"
                :image="item.image"
                text-class="caption"
              />
            </td>
            <td class="py-1 body-2">{{ item.name }}</td>
            <td class="py-1 body-2">{{ item.username }}</td>
            <td class="py-1 text-xs-center">
              <v-btn
                color="primary"
                nuxt=""
                exact=""
                :to="{ name: 'admin-students-id', params: { id: item.id } }"
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

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    AppAvatar
  },
  head() {
    return {
      title: 'Students'
    }
  },
  data() {
    return {
      isPassword: true,
      isPasswordAuto: true,
      user: {
        email: '',
        password: '',
        username: ''
      },
      students: [],
      filter: {
        limit: 0,
        offset: 0,
        pageCount: 0,
        orderBy: ''
      },
      isLoading: false,
      headers: [
        { text: 'Image', value: 'image', sortable: false },
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
        sortBy: 'username',
        totalItems: 20
      },
      totalItems: 0
    }
  },
  watch: {
    pagination: {
      handler({ descending, page, rowsPerPage, sortBy }) {
        if (descending) {
          sortBy = `-${sortBy}`
        }
        this.getStudents({
          orderBy: sortBy,
          limit: rowsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * rowsPerPage
        })
      },
      deep: true
    },
    'user.username': function(value) {
      if (value) {
        this.user.password = `${value}123`
      } else {
        this.user.password = null
      }
    }
  },
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const {
        students: { rowCount, students, ...filter }
      } = await $api.students.getAll({
        orderBy: '-identifier',
        limit: 20,
        offset: 0
      })
      return {
        filter,
        students,
        totalItems: rowCount
      }
    } catch ({ response }) {
      $handleError(response)
    }
  },
  methods: {
    async getStudents(
      { orderBy, limit, offset } = {
        orderBy: '-identifier',
        limit: 20,
        offset: 0
      }
    ) {
      try {
        this.isLoading = true
        const {
          students: { rowCount, students, ...filter }
        } = await this.$api.students.getAll({ orderBy, limit, offset })
        this.filter = filter
        this.totalItems = rowCount
        this.students = students
      } catch ({ response }) {
        this.$handleError(response)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
