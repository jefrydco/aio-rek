<template>
  <div id="subject" class="subject">
    <v-toolbar
      fixed=""
      app=""
      :style="{ ...style, ...toolbarStyle }"
      color="primary"
      dark=""
    >
      <v-toolbar-title>
        <v-avatar size="32" color="blue">
          <span class="white--text">J</span>
        </v-avatar>
        <span class="ml-2">Jefry Dewangga</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid="">
        <v-layout>
          <v-flex xs12="">
            <v-card>
              <v-card-text>
                <v-layout justify-space-between="">
                  <div>{{ subject.name }}</div>
                  <div>{{ subject.percentage }}%</div>
                </v-layout>
                <div
                  class="item__background"
                  :style="
                    `background-color: ${getColor(
                      subject.percentage
                    )}; width: ${subject.percentage}%`
                  "
                ></div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import style from "~/mixins/style";
import colors from "~/mixins/colors";

export default {
  mixins: [style, colors],
  data() {
    return {
      subject: {
        name: "Konsep Pemrograman",
        percentage: 70
      }
    };
  }
};
</script>
