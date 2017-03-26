<template>
  <div>
    <el-table v-loading="!detail" :data="detail||[]">
      <el-table-column prop="type" label="类别" width="120" />
      <el-table-column prop="name" label="项目" min-width="240" />
      <el-table-column prop="amount" label="数量" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="sum" label="总价" />
    </el-table>
    <h4 v-if="!detail">正在获取应付款信息……</h4>
    <h4 v-if="detail">总计应缴费：<b>CNY ¥{{ total }}</b></h4>
  </div>
</template>

<script>
function byTypeThenName(a,b) {
    return a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
}

import { mapGetters } from 'vuex'
export default {
  name: 'billing-detail',
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
    total() {
      return (this.detail||[]).map( $ => $.sum ).reduce( (a,b) => a+b, 0 )
    }
  },
  props: {
    school: { type: String, default: '' },
    round: { type: String, default: '1' }
  },
  data: () => ({
    detail: null,
  }),
  async mounted() {
    try {
      let {
        body
      } = await this.$agent('/api/schools/'+this.school+'/billing')
                .set( ... this.authorization )

      body.sort( byTypeThenName )

      this.detail = body

      this.$emit('loaded')
    } catch(e) {
      this.$notify({
        type: 'error',
        title: '未能获取账单，请稍后再试',
        message: e.message,
        duration: 0
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
h4
  text-align: center
</style>
