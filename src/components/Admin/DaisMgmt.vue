<template>

  <div class="dais-mgmt">
    <h3>
      会场主席审核
      <RefreshButton @click="fetch()" :loading="busy" throttle />
    </h3>

    <div class="layout">
      <el-table class="table" :data="daises" v-loading="!daises">
        <el-table-column label="用户 / 邮箱" prop="contact.email" sortable min-width="120" />
        <el-table-column label="会场" prop="sessionText" sortable min-width="180" />
        <el-table-column label="姓名" prop="contact.name" sortable min-width="90" />
        <el-table-column label="性别" prop="genderText" min-width="48" />
        <el-table-column label="状态" prop="state" sortable min-width="84">
          <template slot-scope="{row}">
            <el-button-group v-if="row.state === null" class="no-wrap">
              <el-button
                type="danger"
                icon="el-icon-close"
                @click="reject(row)"
                :loading="row.busy"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-check"
                @click="accept(row)"
                :loading="row.busy"
              ></el-button>
            </el-button-group>
            <div v-else>
              <el-tag v-if="row.state === true" type="success"> 已通过 </el-tag>
              <el-tag v-if="row.state === false" type="gray"> 已忽略 </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>

</template>

<script>
import genderText from '@/lib/gender-text'
import SessionUtils from '@/lib/session-utils'

const stateToBoolean = (state) => {
  switch (state) {
    case 'accepted': return true
    case 'activated': return true
    case 'rejected': return false
    default: return null
  }
}

const mapDais = $ => ({
  ... $,
  state: stateToBoolean($.state),
  genderText: genderText($.contact.gender),
  sessionText: SessionUtils.methods.SESSION($.session).name,
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
    async accept(dais) {
      dais.busy = true
      try {
        const {
          status,
          body
        } = await this.$agent.post('/api/daises/' + dais.id)
            .send({ activate: true })
            .ok(({ok, status}) => ok || status === 409)
        if (status === 409) {
          this.$notify({
            type: 'warning',
            title: '用户已存在',
            duration: 500
          })
        }
        this.daises.splice(
          this.daises.findIndex($ => $.id === dais.id),
          1,
          mapDais(body)
        )
      } catch(e) {
        console.error(e)
      } finally {
        dais.busy = false
      }
    },
    async reject(dais) {
      try {
        const body = await this.$agent.post('/api/daises/' + dais.id).send({ reject: true }).body()
        this.daises.splice(
          this.daises.findIndex($ => $.id === dais.id),
          1,
          mapDais(body)
        )
      } catch(e) {
        console.error(e)
      } finally {
        dais.busy = false
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
        padding: 4px 6.5px
</style>
