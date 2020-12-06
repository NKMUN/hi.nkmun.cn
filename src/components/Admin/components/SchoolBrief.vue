<template>
  <el-card :class="['school-brief', type]">
    <div slot="header" class="section header">
      <div class="type primary">
        <icon v-if="type === 'school'" name="university" />
        <icon v-if="type === 'individual'" name="user" />
        <span class="text">{{ identifier }}</span>
        <el-button
          v-if="type === 'school'"
          type="warning"
          circle
          icon="el-icon-edit"
          size="mini"
          @click="renameSchool"
          style="margin-left: 1ch"
        />
      </div>
    </div>
    <div>
      <h4 class="primary">
        {{ stage | stageName }}
        <el-button
          type="primary"
          icon="el-icon-tickets"
          style="margin-left: 2ch; padding: 10px"
          plain
          round
          @click="showOpLog"
        />
      </h4>
      <div class="secondary school-name show-hint">{{ contact.name }}</div>
      <div class="secondary">
        {{ contact.gender | genderText }}
        <span class="delimiter" />
        {{ contact.phone }}
        <span class="delimiter" />
        {{ contact.email }}
      </div>
    </div>

    <el-dialog
      :visible.sync="opLogDialogVisible"
      title="操作记录"
      width="90%"
      top="5vh"
      custom-class="school-op-log-dialog"
      @open="fetchOpLog"
    >
      <el-table
        :data="opLog || []"
        style="text-align: left; overflow-y: scroll"
        max-height="78vh"
      >
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <SimpleField name="IP" :value="row.ip || '无'" />
            <SimpleField name="UA" :value="row.user_agent" />

            <SimpleField name="名额" v-if="row.args.seat">
              <table class="seat-table">
                <thead>
                  <th>会场</th> <th>数量</th>
                </thead>
                <tbody>
                  <tr v-for="s in sessions" :key="s.id" v-if="row.args.seat[s.id] > 0">
                    <td>{{s.name}}</td>
                    <td>{{row.args.seat[s.id]}}</td>
                  </tr>
                </tbody>
              </table>
            </SimpleField>

            <div class="reservation" v-if="row.args.hotel">
              <SimpleField name="酒店" :value="row.args.hotel.name" />
              <SimpleField name="房型" :value="row.args.hotel.type" />
              <SimpleField name="入住" :value="row.args.hotel.checkIn" />
              <SimpleField name="退房" :value="row.args.hotel.checkOut" />
              <template v-if="row.args.hotel.initiatingSchool">
                <SimpleField name="拼房" :value="`${row.args.hotel.initiatingSchool.identifier}（发起方）`" />
              </template>
              <template v-if="row.args.hotel.roomshare">
                <SimpleField name="拼房" :value="`${row.args.hotel.roomshare.identifier}（接受方）`" />
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间（中国标准时）" width="180px" prop="time">
          <template slot-scope="{row}">
            {{ row.time | formatToCst }}
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="240px" prop="user">
          <template slot-scope="{row}">
            {{ row.user }}
          </template>
        </el-table-column>
        <el-table-column label="内容" min-width="240px" prop="text" />
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script>
import { getName } from '../../../STAGE_DEF'
import genderText from '@/lib/gender-text'
import dateformat from 'dateformat'
import 'vue-awesome/icons/university'
import 'vue-awesome/icons/user'
import SimpleField from '@/components/SimpleField'
import { mapGetters } from 'vuex'

export default {
  name: 'school-brief',
  components: {
    SimpleField,
  },
  props: {
    data:  { type: Object, required: true },
  },
  computed: {
    ...mapGetters({
      sessions: 'config/sessions'
    }),
    identifier() { return this.data.identifier || null },
    type() { return this.data.type || null },
    school() { return this.data.school || {} },
    contact() { return this.data.leader || {} },
    stage() { return this.data.stage },
    schoolId() { return this.data.id }
  },
  filters: {
    stageName: getName,
    genderText,
    formatToCst(d) {
      // format to chinese standard time
      // simply add 0800 hrs to timestamp, then convert to UTC format string
      const offsetDate = new Date(new Date(d).getTime() + 8*3600*1000)
      return dateformat(offsetDate, 'UTC:yyyy-mm-dd HH:MM:ss')
    }
  },
  data() {
    return {
      opLogDialogVisible: false,
      opLog: [],
    }
  },
  methods: {
    showOpLog() {
      this.opLogDialogVisible = true
    },
    fetchOpLog() {
      this.opLog = null
      return this.$agent.get(`/api/schools/${this.schoolId}/logs`)
        .body()
        .then(
          logs => {
            this.opLog = logs
          },
          err => this.$message({
            type: 'error',
            message: err.message
          })
        )
    },
    renameSchool() {
      return this.$prompt(
        '输入新的学校名字：',
        '学校改名', {
          type: 'warning',
          inputValue: this.school.name
        }
      ).then(
        ({ value: newName }) => {
          if (newName === this.school.name) {
            this.$message({
              type: 'info',
              message: '学校名称未修改'
            })
            return
          }
          return this.$agent
            .patch(`/api/schools/${this.schoolId}/name`)
            .send({ name: newName })
            .body()
            .then(newSchool => {
              const name = newSchool.school.name
              const identifier = newSchool.identifier
              this.$emit('rename', { name, identifier })
              this.$message({
                type: 'success',
                message: `「${this.school.name}」已改名为「${name}」`
              })
              return {name, identifier}
            })
            .catch(e => {
              this.$notify({
                type: 'error',
                title: '改名失败',
                message: e.message,
                duration: 0
              })
            })
        },
        () => {  // cancel
          this.$message({
            type: 'info',
            message: '操作已取消'
          })
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
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
  .school-name
    margin: 6px 0
.school .school-name
  &::after
      hint-text()
      content: "（领队）"
.individual .school-name
  &::after
      hint-text()
      content: "（个人）"
.school-op-log-dialog
  .simple-field
    flex-horz: flex-start flex-start
    .name
      text-align: left
      min-width: 6ch
      max-width: 6ch
      flex: 0 0
      secondary-text()
    .value
      text-align: left
      flex: 1
.seat-table
  td, th
    padding: .5em 2ch
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
  .school-op-log-dialog
    height: 90vh
    margin: 0 auto
</style>

