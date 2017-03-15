<template>
  <div>
    <h2>{{ school.name }}</h2>
    <h4 class="secondary">{{ stage | stageName }}</h4>
  </div>
</template>

<script>
import { getName } from '../../../STAGE_DEF'

export default {
  name: 'school-brief',
  props: {
    data:  { type: Object, required: true },
  },
  computed: {
    school() { return this.data.school || {} },
    stage() { return this.data.stage },
  },
  filters: {
    stageName: getName
  }
}
</script>

<style lang="stylus" scoped>
div
  text-align: center
  .secondary
    color: #475669
    font-weight: normal
</style>
