<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Students</h2>
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
            <td class="py-1 body-2">{{ item.identifier }}</td>
            <td class="py-1 body-2">{{ item.name }}</td>
            <td class="py-1 body-2">{{ item.study_program.name }}</td>
            <td class="py-1 body-2">{{ item.group.name }}</td>
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
        { text: 'Identifier', value: 'identifier' },
        { text: 'Name', value: 'name' },
        { text: 'Study Program', value: 'study_program.name' },
        { text: 'Group', value: 'group.name' },
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
        sortBy: 'identifier',
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
        this.fetchStudents({
          orderBy: sortBy,
          limit: rowsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * rowsPerPage,
          withRelated: 'group,study_program'
        })
      },
      deep: true
    }
  },
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const { rowCount, students, ...filter } = await $api.students.fetchPage({
        orderBy: 'identifier',
        limit: 20,
        offset: 0,
        withRelated: 'group,study_program'
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
    async fetchStudents({
      orderBy = 'identifier',
      limit = 20,
      offset = 0,
      withRelated = 'group,study_program'
    }) {
      try {
        this.isLoading = true
        const {
          rowCount,
          students,
          ...filter
        } = await this.$api.students.fetchPage({
          orderBy,
          limit,
          offset,
          withRelated
        })
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
