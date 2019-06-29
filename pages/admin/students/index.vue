<template>
  <v-card>
    <v-toolbar card="">
      <v-toolbar-title>
        <h2 class="headline">Students</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="accent" @click="fetchStudents">
        Refresh
      </v-btn>
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
            <td class="py-1 body-2">{{ item.major.name }}</td>
            <td class="py-1 body-2">{{ item.group.name }}</td>
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
export default {
  head() {
    return {
      title: 'Students'
    }
  },
  data() {
    return {
      default: {
        name: null,
        identifier: null,
        image: null,
        is_active: true,
        user_id: null,
        major_id: null,
        study_program_id: null,
        group_id: null
      },
      student: {
        name: null,
        identifier: null,
        image: null,
        is_active: true,
        user_id: null,
        major_id: null,
        study_program_id: null,
        group_id: null
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
        { text: 'Identifier', value: 'identifier' },
        { text: 'Name', value: 'name' },
        { text: 'Study Program', value: 'study_program.name' },
        { text: 'Major', value: 'major.name' },
        { text: 'Group', value: 'group.name' },
        { text: 'Is Active?', value: 'group.is_active', align: 'center' },
        { text: 'Action', align: 'center', sortable: false }
      ],
      rowsPerPageItems: [25, 50, 75, 100],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 25,
        sortBy: 'identifier',
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
        this.fetchStudents({
          orderBy: sortBy,
          limit: rowsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * rowsPerPage,
          withRelated: 'study_program,major,group'
        })
      },
      deep: true
    }
  },
  async asyncData({ app: { $api, $http, $handleError } }) {
    try {
      const { rowCount, students, ...filter } = await $api.students.fetchPage({
        orderBy: 'identifier',
        limit: 25,
        offset: 0,
        withRelated: 'study_program,major,group'
      })
      return {
        filter,
        students,
        totalItems: rowCount
      }
    } catch (error) {
      $handleError(error)
    }
  },
  methods: {
    async fetchStudents(
      {
        orderBy = 'identifier',
        limit = 25,
        offset = (this.pagination.page - 1) * this.pagination.rowsPerPage,
        withRelated = 'study_program,major,group'
      } = {
        orderBy: 'identifier',
        limit: 25,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        withRelated: 'study_program,major,group'
      }
    ) {
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
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
