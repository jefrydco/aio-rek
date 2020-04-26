<template>
  <v-card>
    <v-app-bar flat="">
      <v-toolbar-title>
        <h2 class="headline">Students</h2>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="aio-refresh" color="accent" @click="fetchStudents">
        Refresh
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="students"
        :footer-props="{
          'items-per-page-options': rowsPerPageItems
        }"
        :options.sync="pagination"
        :server-items-length="totalItems"
        :loading="isLoading"
      >
        <template #item="{ item, index }">
          <tr :class="{ 'grey lighten-4': index % 2 === 0 }">
            <td class="py-1">
              <app-avatar
                :name="item.name"
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
            <td class="py-1 body-2">
              {{ item.study_program ? item.study_program.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.major ? item.major.name : '' }}
            </td>
            <td class="py-1 body-2">
              {{ item.group ? item.group.name : '' }}
            </td>
            <td class="py-1 body-2 text-center">
              <v-chip v-if="item.is_active" color="info" text-color="white">
                <v-avatar left="" class="info darken-3">
                  <v-icon>check</v-icon>
                </v-avatar>
                <span>Active</span>
              </v-chip>
              <v-chip v-else="" color="error" text-color="white">
                <v-avatar left="" class="error darken-3">
                  <v-icon>close</v-icon>
                </v-avatar>
                <span>Inactive</span>
              </v-chip>
            </td>
            <td class="py-1 body-2 text-center">
              <v-btn
                :class="`aio-edit-${kebabCase(item.name)}`"
                color="primary"
                class="ma-1"
                nuxt=""
                exact=""
                :to="{ name: 'admin-students-id', params: { id: item.id } }"
              >
                Edit
              </v-btn>
              <v-btn
                :class="`aio-delete-${kebabCase(item.name)}`"
                color="error"
                class="ma-1"
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
  mixins: [string],
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
        sortDesc: [false],
        page: 1,
        itemsPerPage: 25,
        sortBy: ['identifier']
      },
      totalItems: 0
    }
  },
  watch: {
    pagination: {
      handler({ sortDesc, page, itemsPerPage, sortBy }) {
        this.fetchStudents({
          orderBy: sortBy,
          limit: itemsPerPage,
          // Taken from: https://stackoverflow.com/a/3521002/7711812
          offset: (page - 1) * itemsPerPage,
          withRelated: 'study_program,major,group',
          sortDesc
        })
      },
      deep: true
    }
  },
  methods: {
    async fetchStudents(
      {
        orderBy = this.pagination.sortBy,
        limit = 25,
        offset = (this.pagination.page - 1) * this.pagination.itemsPerPage,
        withRelated = 'study_program,major,group',
        sortDesc = this.pagination.sortDesc
      } = {
        orderBy: this.pagination.sortBy,
        limit: 25,
        offset: (this.pagination.page - 1) * this.pagination.itemsPerPage,
        withRelated: 'study_program,major,group',
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
  },
  head() {
    return {
      title: 'Students'
    }
  }
}
</script>
