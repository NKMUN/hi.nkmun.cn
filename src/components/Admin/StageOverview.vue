<template>

  <div class="seat-overview">
    <h3>学校状态总览</h3>
    <el-button
      type="primary"
      :loading="busy"
      icon="information"
      @click="fetch()"
    > 刷新 </el-button>
    <div class="layout">
      <el-table class="table" :data="schools" v-loading="!schools">
        <el-table-column label="学校" prop="name" sortable min-width="180" />
        <el-table-column label="状态/阶段" prop="state" sortable min-width="90" />
      </el-table>
    </div>
  </div>

</template>

<script>
import { getName } from '../../STAGE_DEF'
const bySchoolName = (a, b) => (a.name || '').localeCompare(b.name || '')

export default {
  name: 'stage-overview',
  data: () => ({
    schools: null,
    busy: false
  }),
  methods: {
    async fetch() {
      try {
        let {
          body
        } = await this.$agent.get('/api/schools/')
        this.schools = body.sort(bySchoolName).map( $ => ({
          name: $.name,
          state: getName($.stage)
        }))
      } catch (e) {
        this.schools = null
      } finally {
        this.busy = false
      }
    },
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex";
.seat-overview
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
      max-width: 720px
</style>
