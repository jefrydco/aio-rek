<template>
  <v-avatar :color="getColor" :size="size">
    <v-img v-if="image" :src="image" :alt="name">
      <template #placeholder="">
        <v-layout fill-height="" align-center="" justify-center="" ma-0="">
          <v-progress-circular indeterminate="" color="grey lighten-5" />
        </v-layout>
      </template>
      <slot />
    </v-img>
    <span v-else="" :class="getClass">
      {{ getInitials(name) }}
    </span>
  </v-avatar>
</template>

<script>
import { isDark, getMaterialColor, getInitials } from '~/utils/color'

export default {
  name: 'AppAvatar',
  props: {
    name: {
      default: '',
      required: true,
      validator: prop => typeof prop === 'string' || prop === null
    },
    image: {
      default: null,
      required: true,
      validator: prop => typeof prop === 'string' || prop === null
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
      return getMaterialColor(this.name)
    },
    getClass() {
      let classes = this.textClass
      if (this.colorHash) {
        if (isDark(this.colorHash.backgroundColor)) {
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
    },
    getInitials() {
      return string => getInitials(string)
    }
  }
}
</script>
