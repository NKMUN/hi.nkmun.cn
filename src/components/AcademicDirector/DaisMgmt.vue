<template>
  <div class="dais-mgmt">
    <h3>
      会场主席管理
      <RefreshButton @click="fetch()" :loading="busy" throttle />
      <el-button
        @click="exportAs('daises', '.csv')"
        type="primary"
        size="small"
        :disabled="busy"
      > 导出 </el-button>
    </h3>

    <div class="layout">
      <el-table class="table" :data="daises" v-loading="!daises">
        <el-table-column label="用户 / 邮箱" prop="contact.email" sortable min-width="120" />
        <el-table-column label="性别" prop="genderText" min-width="48" />
        <el-table-column label="姓名" prop="contact.name" sortable min-width="90" />
        <el-table-column label="会场" prop="session" sortable width="240">
          <el-select
            slot-scope="{row}"
            v-model="row.session"
            placeholder="请选择会场"
            size="small"
            @change="val => updateSession(row, val)"
            :disabled="row.busy"
          >
            <el-option
              label="[无]"
              :value="null"
            />
            <el-option
              v-for="s in SESSIONS()"
              :key="s.id"
              v-if="s.requiresChairman"
              :label="s.name"
              :value="s.id"
            />
          </el-select>
        </el-table-column>
        <el-table-column label="" prop="state" min-width="84">
          <el-tooltip
            slot-scope="{row}"
            content="惩罚不听话的小朋友"
            placement="top"
            popper-class="dais-mgmt-list-button-tooltip"
          >
            <el-button
              type="danger"
              @click="nuke(row)"
              :loading="row.busy"
            >
              <icon v-if="!row.busy" name="wheelchair" />
            </el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </div>

  </div>

</template>

<script>
import genderText from '@/lib/gender-text'
import SessionUtils from '@/lib/session-utils'
import "vue-awesome/icons/wheelchair"
import { downloadFile } from '@/lib/save-as-file'

const mapDais = $ => ({
  ... $,
  genderText: genderText($.contact.gender),
  busy: false,
})

export default {
  name: 'dais-mgmt',
  mixins: [ SessionUtils ],
  data: () => ({
    daises: null,
    busy: false
  }),
  methods: {
    async fetch() {
      this.busy = true
      try {
        const daises = await this.$agent.get('/api/daises/').body()
        this.daises = daises.map(mapDais)
      } catch (e) {
        console.error(e)
        this.daises = null
      } finally {
        this.busy = false
      }
    },
    updateSession(dais, val) {
      dais.busy = true
      return this.$agent.post(`/api/daises/${dais.id}`).send({
        session: val,
        activate: true
      }).then(
        res => {
          this.$message({
            type: 'success',
            message: `已指定 ${dais.contact.name} 到 ${this.SESSION(val).name} 会场`
          })
          this.daises.splice(
            this.daises.findIndex($ => $.id === dais.id),
            1,
            mapDais(res.body)
          )
        },
        err => this.$message({
          type: 'error',
          message: err.message
        })
      ).then(_ => dais.busy = false)
    },
    nuke(dais) {
      return this.$msgbox({
        title: '确认',
        message: `真的要永久性惩罚 ${dais.contact.name} 吗？`,
        type: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonClass: 'el-button--primary',
        cancelButtonClass: 'el-button--success'
      }).then(
        success => {
          dais.busy = true
          this.$agent.delete(`/api/daises/${dais.id}`).then(
            success => {
              this.$message({
                type: 'success',
                message: `不听话的 ${dais.contact.name} 被扔进黑洞了。`
              })
              this.daises.splice(
                this.daises.findIndex($ => $.id === dais.id),
                1
              )
            },
            err => this.$message({
              type: 'error',
              message: err.message
            })
          )
        },
        err => null
      )
    },
    async exportAs(type, extension) {
      this.busy = true
      try {
        let {
          header
        } = await this.$agent.get('/api/export/'+type)
        downloadFile('/api/export/'+type+header.location, 'NKMUN-'+type.replace(/\//g, '-')+extension)
      } catch(e) {
        this.$notify({
          type: 'warning',
          title: '未能导出',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex";
.dais-mgmt
  flex-vert: flex-start center
  padding-bottom: 3em
  *
    flex-shrink: 0
  .layout
    align-self: stretch
    margin-top: 1em
    margin-bottom: 1em
    padding-left: 8ch
    padding-right: 8ch
    .table
      margin: 0 auto
      width: 100%
      max-width: 960px
      .el-button
        padding: 4px
        height: 28px
        width: 28px
</style>

<style lang="stylus">
.dais-mgmt-list-button-tooltip
  font-size: 75%
  padding: 5px
  transform: translate(0, 4px)
</style>
