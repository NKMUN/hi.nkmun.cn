<template>
  <div>
    <template v-if="detail">
      <template v-if="detail.length">
        <el-table :data="detail">
          <el-table-column prop="type" label="类别" width="120" />
          <el-table-column prop="name" label="项目" min-width="240" />
          <el-table-column prop="amount" label="数量/天数" />
          <el-table-column prop="price" label="单价">
            <div slot-scope="{row}">
              <template v-if="showEarlybirdPrice && row.earlybirdPrice && row.earlybirdPrice !== row.price">
                <div style="text-decoration: line-through; color: #99A9BF">{{ row.price }}</div>
                <div style="">{{ row.earlybirdPrice }}</div>
              </template>
              <template v-else>
                {{ row.price }}
              </template>
            </div>
          </el-table-column>
          <el-table-column prop="sum" label="总价">
            <div slot-scope="{row}">
              <template v-if="showEarlybirdPrice && row.earlybirdSum && row.earlybirdSum !== row.sum">
                <div style="text-decoration: line-through; color: #99A9BF">{{ row.sum }}</div>
                <div style="">{{ row.earlybirdSum }}</div>
              </template>
              <template v-else>
                {{ row.sum }}
              </template>
            </div>
          </el-table-column>
        </el-table>

        <h4>
          {{ getRoundText(round) }}应缴费：
          <template v-if="showEarlybirdPrice && earlybirdTotal && earlybirdTotal !== total">
            <span style="text-decoration: line-through; color: #99A9BF">¥{{ total }}</span>
            <b style="margin-left: 2ch">¥{{ earlybirdTotal }}</b>
            <span style="margin-left: 0.5ch" class="hint">（早鸟折扣）</span>
          </template>
          <template v-else>
            <b>¥{{ total }}</b>
          </template>
          <!-- <template v-if="showAlipayAmount">，支付宝应缴费：<b>¥{{ computeAlipayTotal(total) }}</b> </template> -->
        </h4>

        <el-alert type="success" v-if="showEarlybirdPrice" center style="margin-bottom: 1em" :closable="false">
          <span slot="title">
            在
            <time style="font-weight: bolder" :datetime="new Date(earlybirdDiscountEndTime).toISOString()">{{ toDateTimeString(earlybirdDiscountEndTime) }}</time>
            前完成缴费，可享受早鸟折扣。
          </span>
        </el-alert>

        <el-alert type="error" v-if="earlybirdPriceExpired" center style="margin-bottom: 1em" :closable="false">
          <span slot="title">
            早鸟折扣已于
            <time style="font-weight: bolder" :datetime="new Date(earlybirdDiscountEndTime).toISOString()">{{ toDateTimeString(earlybirdDiscountEndTime) }}</time>
            过期，请缴纳常规会费。
          </span>
        </el-alert>
      </template>

      <template v-else>  <!-- v-else：无需缴费项目 -->
        {{ getRoundText(round) }}无需缴费。
      </template>
    </template>

    <template v-else>  <!-- v-else：detail 非真 / 载入中 -->
      <h4 v-if="!detail">正在获取应付款信息……</h4>
    </template>
  </div>
</template>

<script>
import pinyinCmp from '@/lib/pinyin-cmp'
import roundText from '@/lib/round-text'
import computeAlipayTotal from '@/lib/alipay-surcharge'
import { mapGetters } from 'vuex'
import { toDateTimeString } from '@/lib/date-util'

function byTypeThenName(a,b) {
    return pinyinCmp(a.type, b.type) || pinyinCmp(a.name, b.name)
}

export default {
  name: 'billing-detail',
  computed: {
    ...mapGetters({
      earlybirdDiscountEndTime: 'config/earlybirdDiscountEndTime'
    }),
    showEarlybirdPrice() {
      return this.round === '1' && this.earlybirdDiscountEndTime && this.earlybirdDiscountEndTime >= Date.now()
    },
    earlybirdPriceExpired() {
      return this.round === '1' && this.earlybirdDiscountEndTime && this.earlybirdDiscountEndTime < Date.now()
    },
    total() {
      return (this.detail || []).map( $ => $.sum ).reduce( (a,b) => a+b, 0 )
    },
    earlybirdTotal() {
      return (this.detail || []).map( $ => $.earlybirdSum || $.sum ).reduce( (a,b) => a+b, 0 )
    }
  },
  props: {
    school: { type: String, default: '' },
    round: { type: String, default: '1' },
    roundText: {},
    showAlipayAmount: { type: Boolean, default: false },
  },
  data: () => ({
    detail: null,
  }),
  methods: {
    getRoundText(str) {
      return this.roundText || roundText(str)
    },
    computeAlipayTotal,
    toDateTimeString
  },
  async mounted() {
    try {
      const details = await this.$agent
        .get('/api/schools/'+this.school+'/billing')
        .query({ round: this.round })
        .body()

      this.detail = details.sort( byTypeThenName )
      this.$emit('total-amount')
      this.$emit('loaded', this.detail, this.showEarlybirdPrice ? this.earlybirdTotal : this.total)
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
.hint
  font-size: 80%
  color: #8492A6
</style>
