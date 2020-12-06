<template>
  <div class="export">

    <h4>会场：{{ SESSION(session).name }}</h4>

    <el-table class="table" :data="representatives || []" v-loading="!representatives || busy">
      <el-table-column label="退会" class-name="no-padding" prop="withdraw" width="72">
        <template slot-scope="{row}" v-if="row.withdraw">
          <el-tag type="danger"> <icon name="bomb"/> 退会 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="contact.name" width="108" sortable />
      <el-table-column label="学校" prop="school.school.name" min-width="180" sortable />
      <el-table-column label="性别" class-name="no-padding" prop="genderText" width="48 "/>
      <el-table-column label="邮箱" prop="contact.email" width="180" />
      <el-table-column label="手机" prop="contact.phone" width="144" />
      <el-table-column label="席位" prop="note" min-width="180">
        <el-input
          slot-scope="{row}"
          size="small"
          v-model="row.note"
          autocomplete="off"
          :disabled="row.withdraw"
          @input="row.state = null"
          @change.native="$ev => handleNoteChange($ev.target.value, row)"
          @keydown.enter.native="$ev => handleNoteChange(row.note, row)"
        />
      </el-table-column>
      <el-table-column class-name="no-left-padding" width="36">
        <template slot-scope="{row}">
          <!-- last result -->
          <i v-if="row.busy" class="state busy el-icon-loading"></i>
          <icon v-if="row.state === true" class="state success" name="check" />
          <icon v-if="row.state === false" class="state warning" name="exclamation-triangle" />
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SessionUtils from '@/lib/session-utils'
import genderText from '@/lib/gender-text'
import 'vue-awesome/icons/bomb'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/exclamation-triangle'

const mapRepresentative = $ => ({
  ... $,
  genderText: $.contact && $.contact.gender ? genderText($.contact.gender) : '',
  busy: false,
  state: null
})

export default {
  name: 'session-representative',
  mixins: [ SessionUtils ],
  computed: {
    ...mapGetters({ session: 'user/session' })
  },
  data() {
    return {
      busy: false,
      representatives: null
    }
  },
  methods: {
    async fetch() {
      this.busy = true
      try {
        const representatives = await this.$agent.get('/api/representatives/')
            .query({ session: this.session })
            .body()
        this.representatives = representatives.map( mapRepresentative )
      } catch(e) {
        console.log(e)
      } finally {
        this.busy = false
      }
    },
    async handleNoteChange(val, row) {
      row.busy = true
      try {
        const {
          status,
          body
        } = await this.$agent.patch('/api/representatives/' + row.id)
                .send({ note: val })
        this.representatives.splice(
          this.representatives.findIndex($ => $.id === body.id),
          1,
          {
            ...mapRepresentative(body),
            state: true
          }
        )
      } catch(e) {
        console.log(e)
        row.state = false
      } finally {
        row.busy = false
      }
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus">
.table
  max-width: 960px
  margin: 0 auto
  .state
    &.busy
      color: #20a0ff
    &.success
      color: #13ce66
    &.warning
      color: #f7ba2a
h4
  text-align: center
</style>

<style lang="stylus">
.el-table
  .no-padding .cell
    text-align: center
    padding-left: 0
    padding-right: 0
  .no-left-padding .cell
    text-align: center
    padding-left: 0
</style>