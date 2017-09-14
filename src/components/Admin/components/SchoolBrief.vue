<template>
  <div>
    <h2>{{ school.name }}</h2>
    <h4 class="primary">{{ stage | stageName }}</h4>
    <div class="secondary name show-hint">{{ contact.name }}</div>
    <div class="secondary">
      {{ contact.gender | genderText }}
      <span class="delimiter" />
      {{ contact.phone }}
      <span class="delimiter" />
      {{ contact.email }}
    </div>
  </div>
</template>

<script>
import { getName } from '../../../STAGE_DEF'
import genderText from '@/lib/gender-text'

export default {
  name: 'school-brief',
  props: {
    data:  { type: Object, required: true },
  },
  computed: {
    school() { return this.data.school || {} },
    contact() { return this.data.leader || {} },
    stage() { return this.data.stage },
  },
  filters: {
    stageName: getName,
    genderText
  }
}
</script>

<style lang="stylus" scoped>
primary-text()
  font-size: 16px
  font-weight: bolder
secondary-text()
  font-size: 14px
  font-weight: normal
  color: #475669
hint-text()
  font-weight: normal
  color: #99A9BF
div
  text-align: center
  .secondary
    color: #475669
    font-weight: normal
  .primary
    primary-text()
  .secondary
    secondary-text()
  .delimiter
    &::after
      hint-text()
      margin-left: 1ch
      margin-right: 1ch
      color: #C0CCDA
      content: "/"
  .name
    margin: 6px 0
    &::after
      hint-text()
      content: "（领队）"
</style>
