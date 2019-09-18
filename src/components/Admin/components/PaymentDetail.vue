<template>
  <div>
    <template v-if="detail">
      <template v-if="detail.length">
        <h4>{{ getRoundText(round) }}缴费信息</h4>
        <el-table :data="detail">
          <el-table-column prop="type" label="类别" width="120" />
          <el-table-column prop="name" label="项目" min-width="240" />
          <el-table-column prop="amount" label="数量/天数" />
          <el-table-column prop="price" label="单价" />
          <el-table-column prop="sum" label="总价" />

          <el-table-column v-if="earlybirdDiscountApplicable" prop="earlybirdPrice" label="早鸟单价" >
            <div slot-scope="{row}" v-if="row.earlybirdPrice && row.earlybirdPrice !== row.price">
              {{ row.earlybirdPrice }}
            </div>
          </el-table-column>

          <el-table-column v-if="earlybirdDiscountApplicable" prop="earlybirdSum" label="早鸟总价">
            <div slot-scope="{row}" v-if="row.earlybirdSum && row.earlybirdSum !== row.sum">
              {{ row.earlybirdSum }}
            </div>
          </el-table-column>
        </el-table>

        <template v-if="payment">
          <div class="time-chart">
            <div class="earlybird-end-time hint" v-if="earlybirdDiscountApplicable">
              早鸟折扣截止：<time :datetime="new Date(earlybirdDiscountEndTime).toISOString()">{{ toDateTimeString(earlybirdDiscountEndTime) }}</time>
            </div>
            <div class="upload-time">
              凭证上传时间：<time :datetime="payment.time">{{ toDateTimeString(payment.time) }}</time>
            </div>
          </div>

          <div class="rate-chart" v-if="payment.active">
            <div>
              常规会费：¥ <b class="monospace">{{total}}</b>
              <i class="el-icon-check" style="color: #67c23a; visibility: hidden" />
            </div>
            <div v-if="earlybirdDiscountApplicable">
              早鸟会费：¥ <b class="monospace">{{earlybirdTotal}}</b>
              <i v-if="new Date(payment.time).getTime() <= earlybirdDiscountEndTime" class="el-icon-check" style="color: #67c23a" />
              <i v-if="new Date(payment.time).getTime() > earlybirdDiscountEndTime" class="el-icon-close" style="color: #f56c6c" />
            </div>
          </div>

          <div class="rate-chart" v-if="!payment.active && payment.effectiveRule">
            <div v-if="payment.effectiveRule === 'ordinary'">
              常规会费：¥ <b class="monospace">{{total}}</b>，已审核
            </div>
            <div v-if="payment.effectiveRule === 'earlybird'">
              早鸟会费：¥ <b class="monospace">{{earlybirdTotal}}</b>，已审核
            </div>
          </div>

          <PaymentEntry :data="payment" />
        </template>
        <template v-else> <!-- payment 非真 -->
          <h5>未上传凭证</h5>
        </template>
      </template>

      <template v-else>  <!-- v-else：无需缴费项目 -->
        <h4>{{ getRoundText(round) }}无需缴费</h4>
      </template>
    </template>

    <template v-else>  <!-- v-else：detail 非真 / 载入中 -->
      <h4>正在获取应付款信息……</h4>
    </template>
  </div>
</template>

<script>
import pinyinCmp from '@/lib/pinyin-cmp'
import roundText from '@/lib/round-text'
import computeAlipayTotal from '@/lib/alipay-surcharge'
import { mapGetters } from 'vuex'
import { toDateTimeString } from '@/lib/date-util'
import PaymentEntry from './PaymentEntry'

function byTypeThenName(a,b) {
    return pinyinCmp(a.type, b.type) || pinyinCmp(a.name, b.name)
}

export default {
  name: 'payment-detail',
  components: {
    PaymentEntry
  },
  computed: {
    ...mapGetters({
      earlybirdDiscountEndTime: 'config/earlybirdDiscountEndTime'
    }),
    total() {
      return (this.detail || []).map( $ => $.sum ).reduce( (a,b) => a+b, 0 )
    },
    earlybirdTotal() {
      return (this.detail || []).map( $ => $.earlybirdSum || $.sum ).reduce( (a,b) => a+b, 0 )
    },
    earlybirdDiscountApplicable() {
      return this.round === '1' && this.earlybirdDiscountEndTime
    },
  },
  props: {
    school: { type: String, default: '' },
    round: { type: String, default: '1' },
    roundText: {},
    showAlipayAmount: { type: Boolean, default: false },
    payment: {},
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
@import "../../../style/flex"
h4, h5
  text-align: center
.hint
  color: #8492A6
.rate-chart, .time-chart
  flex-vert: flex-start center
  word-break: keep-all
  word-wrap: normal
  margin-top: 1em
  margin-bottom: 1em
time
  font-weight: bolder
.monospace, time
  font-family: 'Courier New', Courier, monospace
</style>
