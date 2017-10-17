<template>
  <div>
    <template v-if="detail && detail.length">
      <el-table v-loading="!detail" :data="detail||[]">
        <el-table-column prop="type" label="类别" width="120" />
        <el-table-column prop="name" label="项目" min-width="240" />
        <el-table-column prop="amount" label="数量/天数" />
        <el-table-column prop="price" label="单价" />
        <el-table-column prop="sum" label="总价" />
      </el-table>
      <h4 v-if="!detail">正在获取应付款信息……</h4>
      <h4 v-if="detail">{{round | roundText}}应缴费：<b>CNY ¥{{ total }}</b></h4>
    </template>
    <template v-else>
      <h4>{{round | roundText}}无需缴费</h4>
    </template>
  </div>
</template>

<script>
import pinyinCmp from '@/lib/pinyin-cmp'
import roundText from '@/lib/round-text'

function byTypeThenName(a,b) {
    return pinyinCmp(a.type, b.type) || pinyinCmp(a.name, b.name)
}

export default {
  name: 'billing-detail',
  computed: {
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
  filters: {
    roundText
  },
  async mounted() {
    try {
      const details = await this.$agent
        .get('/api/schools/'+this.school+'/billing')
        .query({ round: this.round })
        .body()

      this.detail = details.sort( byTypeThenName )

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
