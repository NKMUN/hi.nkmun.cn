<template>

  <div class="export">
    <h3>导出</h3>

    <el-button
      @click="exportAs('applications/seats', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="wpforms"/> 报名 - 名额分配 </el-button>

    <el-button
      @click="exportAs('applications/contacts', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="phone"/> 报名 - 联系人 </el-button>

    <el-button
      @click="exportAs('seats', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="table"/> 当前名额 </el-button>

    <el-button
      @click="exportAs('leaders', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="flag"/> 领队信息 </el-button>

    <el-button
      @click="exportAs('representatives', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="id-card"/> 代表信息 </el-button>

    <el-button
      @click="exportAs('reservations', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="bed"/> 住宿信息 </el-button>

    <el-button
      @click="exportAs('billings', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="jpy"/> 付款信息 </el-button>

    <el-button
      @click="exportAs('committees', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="users"/> 组委信息 </el-button>

    <el-button
      @click="exportAs('committees/photos', '.zip')"
      type="primary"
      :disabled="busy"
    > <icon name="photo"/> 组委照片 </el-button>

    <el-button
      @click="exportAs('volunteers', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="handshake-o"/> 志愿者信息 </el-button>

    <el-button
      @click="exportAs('daises', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="user-secret"/> 会场主席信息 </el-button>

    <el-button
      @click="exportAs('daises/photos', '.zip')"
      type="primary"
      :disabled="busy"
    > <icon name="photo"/> 会场主席照片 </el-button>

    <el-button
      @click="exportAs('daises/reimbursements', '.csv')"
      type="primary"
      :disabled="busy"
    > <icon name="money"/> 报销清单 </el-button>

    <el-button
      @click="exportAs('daises/reimbursement-credentials', '.zip')"
      type="primary"
      :disabled="busy"
    > <icon name="ticket"/> 报销凭证 </el-button>

  </div>

</template>

<script>
import { downloadFile } from '@/lib/save-as-file'
import 'vue-awesome/icons/wpforms'
import 'vue-awesome/icons/phone'
import 'vue-awesome/icons/table'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/photo'
import 'vue-awesome/icons/flag'
import 'vue-awesome/icons/id-card'
import 'vue-awesome/icons/jpy'
import 'vue-awesome/icons/bed'
import 'vue-awesome/icons/handshake-o'
import 'vue-awesome/icons/user-secret'
import 'vue-awesome/icons/money'
import 'vue-awesome/icons/ticket'

export default {
  name: 'export',
  data: () => ({
    busy: false,
  }),
  methods: {
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
.fa-icon
  vertical-align: bottom
  opacity: 0.8
  margin-right: .5ch
</style>
