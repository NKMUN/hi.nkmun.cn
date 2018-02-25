<template>
  <el-card class="application">
    <div slot="header" class="section school">
      <div class="primary name">{{ school.name }}</div>
      <div class="secondary english-name">{{ school.englishName }}</div>
      <div class="secondary address">{{ school.address }}</div>
    </div>
    <div>
      <div class="section contact">
        <div class="primary name show-hint">{{ contact.name }}</div>
        <div class="secondary">
          {{ contact.gender | genderText }}
          <span class="delimiter" />
          {{ contact.phone }}
          <span class="delimiter" />
          {{ contact.email }}
        </div>
      </div>
      <div class="section contact alt-contact">
        <div class="primary name show-hint">{{ altContact.name }}</div>
        <div class="secondary">
          {{ altContact.gender | genderText }}
          <span class="delimiter" />
          {{ altContact.phone }}
          <span class="delimiter" />
          {{ altContact.email }}
        </div>
      </div>
      <div class="section test" v-for="test in tests" :key="test.id">
        <div class="question hint">{{ test.question }}</div>
        <div class="answer">
          <!-- do not use v-html, it leads to XSS injection -->
          <p v-for="(p, idx) in toParagraphs(acTest[test.id])" :key="idx">{{ p }}</p>
        </div>
      </div>
      <div class="section request">
        <div class="primary">名额申请</div>
        <table>
          <tbody>
            <tr v-for="(r, idx) in requestRows" :key="idx" v-if="request[r.key]">
              <td class="session">{{ r.text }}</td>
              <td class="amount">{{ request[r.key] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-card>
</template>

<script>
import genderText from '@/lib/gender-text'

export default {
  name: 'application-card',
  props: {
    data:  { type: Object, required: true },
    tests: { type: Array, required: true },
  },
  computed: {
    school() { return this.data.school || {} },
    contact() { return this.data.contact || {} },
    altContact() { return this.data.altContact || {} },
    acTest() { return this.data.acTest || {} },
    request() { return this.data.request || {} }
  },
  data: () => ({
    requestRows: [
      { key: 'chinese',    text: '中文会场' },
      { key: 'english',    text: '英文会场' },
      { key: 'press',      text: '媒体团队' },
      { key: 'supervisor', text: '指导教师' },
      { key: 'observer',   text: '观察员'   },
    ]
  }),
  methods: {
    toParagraphs(v) {
      return v.replace(/\r\n/, '\n')
              .split(/[\r\n]{2,}/)
    }
  },
  filters: {
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

.application
  // stretch horizontally
  max-width: 70ch
  width: 100%
  text-align: center
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
  .section
    &.contact .name::after
      content: "（第一联系人）"
    &.alt-contact .name::after
      content: "（第二联系人）"
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
