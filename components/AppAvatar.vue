<template>
  <v-avatar :color="getColor" :size="size">
    <v-img v-if="image.length > 0" :src="image" :alt="name">
      <template #placeholder="">
        <v-layout fill-height="" align-center="" justify-center="" ma-0="">
          <v-progress-circular indeterminate="" color="grey lighten-5" />
        </v-layout>
      </template>
      <slot />
    </v-img>
    <span v-else="" :class="getClass">
      {{ initials(name) }}
    </span>
  </v-avatar>
</template>

<script>
import avatar from '~/mixins/avatar'

export default {
  mixins: [avatar],
  props: {
    name: {
      type: String,
      default: '',
      required: true
    },
    image: {
      type: String,
      default: '',
      required: true
    },
    size: {
      type: [String, Number],
      default: '48'
    },
    textClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    colorHash() {
      return this.materialColorHash(this.name)
    },
    getClass() {
      let classes = this.textClass
      if (this.colorHash) {
        if (this.isDarkColor(this.colorHash.backgroundColor)) {
          classes = `${classes} white--text`
        }
        return classes
      }
      return classes
    },
    getColor() {
      if (this.colorHash) {
        return this.colorHash.materialColorName.toLowerCase()
      }
      return ''
    }
  }
}
</script>
