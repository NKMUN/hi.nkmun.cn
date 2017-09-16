<template>

  <div class="export">
    <h3>导出</h3>

    <el-button
      @click="exportCsv('seats')"
      type="primary"
      :disabled="busy"
    > 名额分配 </el-button>

    <el-button
      @click="exportCsv('leaders')"
      type="primary"
      :disabled="busy"
    > 领队信息 </el-button>

    <el-button
      @click="exportCsv('representatives')"
      type="primary"
      :disabled="busy"
    > 代表信息 </el-button>

    <el-button
      @click="exportCsv('reservations')"
      type="primary"
      :disabled="busy"
    > 住宿信息 </el-button>

    <el-button
      @click="exportCsv('billings')"
      type="primary"
      :disabled="busy"
    > 付款信息 </el-button>

    <el-button
      @click="exportCsv('committees')"
      type="primary"
      :disabled="busy"
    > 组委信息 </el-button>

    <el-button
      @click="exportZip('committees/photos')"
      type="primary"
      :disabled="busy"
    > 组委照片 </el-button>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import {saveAsFile, downloadFile} from '@/lib/save-as-file'

export default {
  name: 'export',
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    })
  },
  data: () => ({
    busy: false,
  }),
  methods: {
    async exportCsv(type) {
      this.busy = true
      try {
        let {
          body: blob
        } = await this.$agent.get('/api/export/'+type)
                  .responseType('blob')
                  .set( ... this.authorization )
        saveAsFile(blob, 'NKMUN-'+type+'.csv')
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
    },
    async exportZip(type) {
      this.busy = true
      try {
        let {
          header
        } = await this.$agent.get('/api/export/'+type)
                  .set( ... this.authorization )
        downloadFile('/api/export/'+type+header.location, 'NKMUN-'+type.replace(/-/g, '-')+'.zip')
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
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex";
.export
  flex-vert: flex-start center
  *
    flex-shrink: 0
.el-button
  margin: .5em 0
</style>
