<template>
  <el-card :class="['application', type]">
    <div slot="header" class="section header">
      <div class="type primary">
        <template v-if="type === 'school'">
          <icon name="institution" />
          <span class="text">学校申请</span>
        </template>
        <template v-if="type === 'individual'">
          <icon name="user" />
          <span class="text">个人申请</span>
        </template>
      </div>
    </div>
    <div>
      <template v-if="type === 'school'">
        <div class="section school">
          <div class="primary name">{{ school.name }}</div>
          <div class="secondary english-name">{{ school.englishName }}</div>
          <div class="secondary address">{{ school.administrative_area }} <span class="delimiter" /> {{ school.address }}</div>
        </div>
        <div v-if="type === 'school'" class="section contact">
          <div class="primary name show-hint">{{ contact.name }}</div>
          <div class="secondary">
            {{ contact.gender | genderText }}
            <span class="delimiter" />
            {{ contact.phone }}
            <span class="delimiter" />
            {{ contact.email }}
          </div>
        </div>
        <div v-if="type === 'school'" class="section contact alt-contact">
          <div class="primary name show-hint">{{ alt_contact.name }}</div>
          <div class="secondary">
            {{ alt_contact.gender | genderText }}
            <span class="delimiter" />
            {{ alt_contact.phone }}
            <span class="delimiter" />
            {{ alt_contact.email }}
          </div>
        </div>
      </template>

      <template v-if="type === 'individual'">
        <div class="section individual">
          <div class="primary name">{{ contact.name }}</div>
          <div class="secondary">
            {{ contact.gender | genderText }}
            <span class="delimiter" />
            {{ contact.phone }}
            <span class="delimiter" />
            {{ contact.email }}
          </div>
        </div>
        <div class="section school">
          <div class="primary name show-hint">{{ school.name }}</div>
          <div class="secondary english-name">{{ school.englishName }}</div>
          <div class="secondary address">{{ school.administrative_area }} <span class="delimiter" /> {{ school.address }}</div>
        </div>
        <div class="section contact guardian">
          <div class="primary name show-hint">{{ guardian.name }}</div>
          <div class="secondary">
            {{ guardian.type | guardianTypeText }}
            <span class="delimiter" />
            {{ guardian.phone }}
          </div>
        </div>
      </template>

      <div class="section test" v-for="test in tests" :key="test.id">
        <div class="question hint">{{ test.question }}</div>
        <div class="answer">
          <!-- do not use v-html, it leads to XSS injection -->
          <p v-for="(p, idx) in toParagraphs(ac_test[test.id] || '')" :key="test.id + idx">{{ p }}</p>
        </div>
      </div>

      <!-- 学校/团队的申请信息在 SeatInputWithRequest 中显示 -->
      <div class="section individual-request" v-if="type === 'individual'">
        <div class="primary">
          <span class="secondary">名额申请：</span>
          {{ individualRequestedSession && individualRequestedSession.name || `未知：${JSON.stringify(data.request_individual)}`}}
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import 'vue-awesome/icons/institution'
import 'vue-awesome/icons/user'

import genderText from '@/lib/gender-text'
import guardianTypeText from '@/lib/guardian-type-text'
import { mapGetters } from 'vuex'

export default {
  name: 'application-card',
  props: {
    data:  { type: Object, required: true },
    tests: { type: Array, required: true },
  },
  computed: {
    ...mapGetters({
      sessions: 'config/sessions'
    }),
    type() { return this.data.type || 'school' },
    school() { return this.data.school || {} },
    contact() { return this.data.contact || {} },
    alt_contact() { return this.data.alt_contact || {} },
    guardian() { return this.data.guardian || {} },
    ac_test() { return this.data.ac_test || {} },
    request() { return this.data.request || {} },
    individualRequestedSession() {
      const request = this.data.request_individual || {}
      const individualSessionId = Object.keys(request).find(id => request[id] > 0)
      return this.sessions.find($ => $.id === individualSessionId)
    }
  },
  methods: {
    toParagraphs(v) {
      return v.replace(/\r\n/, '\n')
              .split(/[\r\n]{2,}/)
    }
  },
  filters: {
    genderText,
    guardianTypeText
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

.application
  // stretch horizontally
  max-width: 70ch
  width: 100%
  text-align: center
  .type
    display: flex
    flex-direction: row
    align-items: center
    justify-content: center
    .text
      margin-left: 1ch
  .section
    &:not(:first-child)
      margin-top: 40px    // match primary-text size
    div:not(:first-child)
      margin-top: 1em
    table
      margin: .5em auto
    .primary
      primary-text()
    .secondary
      secondary-text()
    .hint
      hint-text()
    .delimiter
      &::after
        hint-text()
        margin-left: 1ch
        margin-right: 1ch
        color: #C0CCDA
        content: "/"
    .show-hint
      position: relative
      &::after
        display: inline-block    // necessary for transform to work
        position: absolute
        transform: scale(0.8, 0.8)
        padding-left: 1ch
        transform-origin: left center
        hint-text()
  &.individual .section
    &.school .name::after
      content: "（学校）"
  .section
    &.contact .name::after
      content: "（第一联系人）"
    &.alt-contact .name::after
      content: "（第二联系人）"
    &.guardian .name::after
      content: "（监护人）"
    &.test
      .answer
        margin: .5em auto
        text-align: left
        max-width: 60ch
        word-break: break-word
        p
          line-height: 1.5
          font-size: 14px
          white-space: pre-wrap
          &:first-child
            margin-top: 0
          &:last-child
            margin-bottom: 0
      .question
        font-size: 14px
        text-align: left
    &.request
      .session
        padding-right: 2ch
        text-align: right
      .amount
        font-family: monospace
        text-align: left
        min-width: 2ch
        font-size: 16px
</style>

<style lang="stylus">
.application
  &.school
    .el-card__header
      background-color: #f6ffed
      color: #135200
  &.individual
    .el-card__header
      background-color: #e6f7ff
      color: #003a8c
</style>
