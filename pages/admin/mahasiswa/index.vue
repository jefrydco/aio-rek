<template>
  <v-container fluid="" grid-list-xl="">
    <v-layout justify-space-between="">
      <h2 class="ma-3 display-1">Mahasiswa</h2>
      <div>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn class="ma-3" color="primary" v-on="on">Tambah</v-btn>
          </template>
          <span>Tambah mahasiswa baru</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn class="ma-3" color="accent" v-on="on">Sinkronisasi</v-btn>
          </template>
          <span>Sinkronisasi data dengan MIS</span>
        </v-tooltip>
      </div>
    </v-layout>
    <v-layout>
      <v-flex xs12="">
        <v-card>
          <v-card-text>
            <v-layout wrap="">
              <v-flex xs12="" sm2="">
                <v-autocomplete label="Kelas" box="" />
              </v-flex>
              <v-flex xs12="" sm2="">
                <v-autocomplete label="Program Studi" box="" />
              </v-flex>
              <v-flex xs12="" sm2="">
                <v-autocomplete label="Rentang Kehadiran" box="" />
              </v-flex>
            </v-layout>
            <v-divider />
            <v-data-table :items="students" :headers="headers">
              <template #items="{ item }">
                <td>{{ item.nrp }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.class }}</td>
                <td>
                  <v-alert
                    :value="true"
                    :color="getColorFromPercentage(item.percentage)"
                    outline=""
                    class="text-xs-center"
                  >
                    <strong>
                      {{
                        Intl.NumberFormat('id-ID', {
                          style: 'percent',
                          minimumFractionDigits: 2
                        }).format(item.percentage)
                      }}
                    </strong>
                  </v-alert>
                </td>
                <td>
                  <v-tooltip bottom="">
                    <template #activator="{ on }">
                      <v-btn color="primary" depressed="" v-on="on">
                        Lihat
                      </v-btn>
                    </template>
                    <span>Lihat {{ item.name }}</span>
                  </v-tooltip>
                  <v-tooltip bottom="">
                    <template #activator="{ on }">
                      <v-btn color="primary" depressed="" v-on="on">
                        Edit
                      </v-btn>
                    </template>
                    <span>Edit {{ item.name }}</span>
                  </v-tooltip>
                  <v-tooltip bottom="">
                    <template #activator="{ on }">
                      <v-btn color="error" depressed="" v-on="on">Hapus</v-btn>
                    </template>
                    <span>Hapus {{ item.name }}</span>
                  </v-tooltip>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'NRP', value: 'nrp' },
        { text: 'Nama', value: 'name' },
        { text: 'Kelas', value: 'class' },
        { text: 'Persentase Kehadiran', value: 'percentage' },
        { text: 'Aksi', sortable: false }
      ],
      students: Array.from({ length: 4 }, (v, i) => ({
        nrp: `210316100${i}`,
        name: 'Jefry Dewangga',
        class: '3 D3 IT A',
        percentage: Math.random()
      }))
    }
  },
  computed: {
    getColorFromPercentage() {
      return value => {
        if (!value) {
          return 'grey darken-3'
        }
        value = parseFloat(value)
        if (value >= 0 && value < 0.25) {
          return 'error'
        }
        if (value >= 0.25 && value < 0.5) {
          return 'warning'
        }
        if (value >= 0.5 && value < 0.75) {
          return 'info'
        }
        if (value >= 0.75 && value <= 1) {
          return 'success'
        }
        return 'grey darken-3'
      }
    }
  }
}
</script>
