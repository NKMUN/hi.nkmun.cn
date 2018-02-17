<template>

  <div class="seat-overview">
    <h3>
      学校状态总览
      <RefreshButton @click="fetch()" :loading="busy" throttle />
    </h3>
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
import pinyinCmp from '@/lib/pinyin-cmp'
const bySchoolName = (a, b) => pinyinCmp(a.name, b.name)

export default {
  name: 'stage-overview',
  data: () => ({
    schools: null,
    busy: false
  }),
  methods: {
    async fetch() {
      this.busy = true
      try {
        const schools = await this.$agent.get('/api/schools/').body()
        this.schools = schools
          .sort(bySchoolName)
          .map($ => ({
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
