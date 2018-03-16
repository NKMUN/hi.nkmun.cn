<template>
  <el-card :class="['school-brief', type]">
    <div slot="header" class="section header">
      <div class="type primary">
        <icon v-if="type === 'school'" name="institution" />
        <icon v-if="type === 'individual'" name="user" />
        <span class="text">{{ identifier }}</span>
      </div>
    </div>
    <div>
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
  </el-card>
</template>

<script>
import { getName } from '../../../STAGE_DEF'
import genderText from '@/lib/gender-text'

import 'vue-awesome/icons/institution'
import 'vue-awesome/icons/user'

export default {
  name: 'school-brief',
  props: {
    data:  { type: Object, required: true },
  },
  computed: {
    identifier() { return this.data.identifier || null },
    type() { return this.data.type || null },
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
.el-card
  margin: 1em auto 2em auto
  text-align: center
  min-width: 60ch
  h4
    margin-top: 0
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
.school .name
  &::after
      hint-text()
      content: "（领队）"
.individual .name
  &::after
      hint-text()
      content: "（个人）"
</style>

<style lang="stylus">
.school-brief
  &.school
    .el-card__header
      background-color: #f6ffed
      color: #135200
  &.individual
    .el-card__header
      background-color: #e6f7ff
      color: #003a8c
</style>

