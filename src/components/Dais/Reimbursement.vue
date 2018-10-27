<script>
import { get, set } from '@/lib/property-accessor'
import ProvinceCity from '@/components/form/ProvinceCity'
import MultipleImageUpload from '@/components/form/MultipleImageUpload'
import ReimbursementRule from './ReimbursementRule'
import 'vue-awesome/icons/sign-in'
import 'vue-awesome/icons/sign-out'

const REIMBURSEMENT_UPPER_BOUND = 800

export default {
  data() {
    return {
      reimbursement: null,
      busy: false,
      maximumReimbursementCost: 800
    }
  },
  computed: {
    totalCost() {
      return get(this.reimbursement, 'inbound.cost') || 0 + get(this.reimbursement, 'outbound.cost') || 0
    }
  },
  methods: {
    fetch() {
      this.busy = true
      return this.$agent.get('/api/daises/~/reimbursement/').then(
        resp => {
          this.reimbursement = resp.body
        },
        err => this.$message({
          type: 'warning',
          message: '服务器故障，请稍后再试'
        })
      )
      .then(_ => this.busy = false)
    },
    submitTrip(tripKey, tripPayload) {
      this.busy = true
      return this.$agent.patch('/api/daises/~/reimbursement/')
        .send({ [tripKey]: tripPayload })
        .ok(resp => resp.ok || resp.status === 400)
        .then(
          resp => {
            if (resp.status === 400) {
              return this.$message({
                type: 'error',
                message: '不能提交：' + resp.body.message
              })
            }
            this.reimbursement = {
              ...this.reimbursement,
              [tripKey]: resp.body[tripKey]
            }
            this.$message({
              type: 'success',
              message: '已提交，请等待审核。'
            })
          },
          err => this.$message({
            type: 'warning',
            message: '不能提交，请稍后再试'
          })
        )
        .then(_ => this.busy = false)
    },
    submitBasicInfo() {
      this.busy = true
      const payload = {
        school_region: get(this.reimbursement, 'school_region'),
        residence_region: get(this.reimbursement, 'residence_region'),
        payment_method: get(this.reimbursement, 'payment_method'),
        bank: get(this.reimbursement, 'bank'),
        alipay: get(this.reimbursement, 'alipay'),
      }
      return this.$agent.patch('/api/daises/~/reimbursement/')
        .send(payload)
        .ok(resp => resp.ok || resp.status === 400)
        .then(
          resp => {
            if (resp.status === 400) {
              return this.$message({
                type: 'error',
                message: '不能提交：' + resp.body.message
              })
            }
            this.reimbursement = {
              ...this.reimbursement,
              school_region: resp.body.school_region,
              residence_region: resp.body.residence_region,
              payment_method: resp.body.payment_method,
              bank: resp.body.bank,
              alipay: resp.body.alipay,
            }
            this.$message({
              type: 'success',
              message: '基本信息已保存'
            })
          },
          err => this.$message({
            type: 'warning',
            message: '不能提交，请稍后再试'
          })
        )
        .then(_ => this.busy = false)
    },
    submitInbound() {
      const gi = attr => get(this.reimbursement, `inbound.${attr}`)
      const payload = {
        region: gi('region'),
        cost: gi('cost'),
        note: gi('note'),
        credential: gi('credential')
      }

      let errors = []
      if (!payload.region) errors.push('请选择出发地')
      if (!payload.cost && payload.cost !== 0) errors.push('请输入金额')
      if (!payload.credential || !payload.credential.length) errors.push('请上传凭证')
      if (errors.length) {
        return this.$msgbox({
          type: 'warning',
          title: '请修正表单中的错误',
          message: `<p>${ errors.join('<br>') }</p>`,
          dangerouslyUseHTMLString: true
        })
      } else {
        return this.submitTrip('inbound', payload)
      }
    },
    submitOutbound() {
      const go = attr => get(this.reimbursement, `outbound.${attr}`)
      const payload = {
        region: go('region'),
        cost: go('cost'),
        note: go('note'),
        credential: go('credential')
      }

      let errors = []
      if (!payload.region) errors.push('请选择目的地')
      if (!payload.cost && payload.cost !== 0) errors.push('请输入金额')
      if (!payload.credential || !payload.credential.length) errors.push('请上传凭证')
      if (errors.length) {
        return this.$msgbox({
          type: 'warning',
          title: '请修正表单中的错误',
          message: `<p>${ errors.join('<br>') }</p>`,
          dangerouslyUseHTMLString: true
        })
      } else {
        return this.submitTrip('outbound', payload)
      }
    },
    checkImageFormat(file) {
      if ( ! (file.type === 'image/jpeg' || file.type === 'image/png') ) {
        this.$message({
          message: '图片必须是 png 或 jpg 格式',
          type: 'error'
        })
        return false
      }
      if ( file.size / 1024 / 1024 > 4 ) {
        this.$message({
          message: '图片必须小于 4MB',
          type: 'error'
        })
        return false
      }
      return true
    },
  },
  render() {
    const g = attr => get(this.reimbursement, attr)
    const s = attr => val => this.reimbursement = set(this.reimbursement, attr, val)
    const defineField = field => ({
      attrs: {
        autocomplete: 'off',
        value: g(field)
      },
      on: {
        input: s(field)
      }
    })

    const {
      busy,
      reimbursement: model
    } = this

    const renderPaymentMethod = () => {
      switch (g('payment_method')) {
        case 'cash': return (<p class="hint"> 现金报销：请在会议期间自行联系组委领取 </p>)
        case 'bank': return (
          <div>
            <el-form-item label="银行卡号" prop="bank.account">
              <el-input {...defineField('bank.account')} />
            </el-form-item>
            <el-form-item label="开户行" prop="bank.branch">
              <el-input {...defineField('bank.branch')} />
            </el-form-item>
            <el-form-item label="开户人" prop="bank.name">
              <el-input {...defineField('bank.name')} />
            </el-form-item>
          </div>
        )
        case 'alipay': return (
          <div>
            <el-form-item label="支付宝账号" prop="alipay.account">
              <el-input {...defineField('alipay.account')} />
            </el-form-item>
            <el-form-item label="姓名" prop="alipay.name">
              <el-input {...defineField('alipay.name')} />
            </el-form-item>
          </div>
        )
        default: return (<p class="hint"> 请选择支付方式 </p>)
      }
    }

    const renderTripState = (tripKey) => {
      switch (g(`${tripKey}.state`)) {
        case 'submitted': return <el-tag> 已提交，请等待审核 </el-tag>
        case 'approved':  return <el-tag type="success"> 已批准，请等待发放报销 </el-tag>
        case 'rejected':  return <el-tag type="danger"> 未批准 </el-tag>
        case 'completed': return <el-tag type="success"> 已完成 </el-tag>
        default:          return <el-tag type="info"> 未提交 </el-tag>
      }
    }

    const renderUpperboundWarning = () => {
      const totalCost = (g('inbound.cost') || 0) + (g('outbound.cost') || 0)
      return totalCost > REIMBURSEMENT_UPPER_BOUND
        ? <el-alert
            title="交通费报销上限为 ¥800"
            type="warning"
            show-icon
            closable={ false }
          />
        : null
    }

    const renderRejectionNote = (tripKey) => {
      const note = g(`${tripKey}.review_note`)
      const state = g(`${tripKey}.state`)
      return note && state === 'rejected'
        ? <el-alert
            title={ `审核结果：${note}` }
            type="error"
            show-icon
            closable={ false }
          />
        : null
    }

    const tripDisabledStates = ['submitted', 'approved', 'completed']
    const inboundFreezed = tripDisabledStates.includes(g('inbound.state'))
    const outboundFreezed = tripDisabledStates.includes(g('outbound.state'))

    return (
      <div class="reimbursement">
        <h4>行程报销</h4>

        <ReimbursementRule />

        <el-form
          class="basic-info"
          label-width="108px"
          label-position="right"
          size="medium"
          model={ model }
          disabled={ busy }
          show-message={ false }
        >
          <el-form-item label="学校所在地" prop="school_region">
            <ProvinceCity {...defineField('school_region')} />
          </el-form-item>

          <el-form-item label="家庭居住地" prop="residence_region">
            <ProvinceCity {...defineField('residence_region')} />
          </el-form-item>

          <el-form-item label="支付方式" prop="payment_method">
            <el-radio-group {...defineField('payment_method')}>
              <el-radio label="cash"> 现金 </el-radio>
              <el-radio label="bank"> 银行转帐 </el-radio>
              <el-radio label="alipay"> 支付宝 </el-radio>
            </el-radio-group>
          </el-form-item>

          { renderPaymentMethod() }

          <div class="center-children">
            <el-button size="small" type="primary" onClick={ this.submitBasicInfo }> 保存基本信息 </el-button>
          </div>
        </el-form>


        <div class="trip-wrapper">
          <el-form
            class="trip inbound"
            label-width="72px"
            label-position="right"
            size="medium"
            model={ model && model.inbound }
            disabled={ busy || inboundFreezed }
            show-message={ false }
          >
            <h5 class="trip-title"> <icon name="sign-in" /> 来程 </h5>
            <el-form-item label="出发地" prop="region">
              <ProvinceCity {...defineField('inbound.region')} />
            </el-form-item>
            <el-form-item label="金额" prop="cost">
              <el-input-number step={10} min={0} precision={2} controls={false} {...defineField('inbound.cost')} />
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input {...defineField('inbound.note')} />
            </el-form-item>
            <el-form-item class="top-label" label="凭证" prop="credential">
              <MultipleImageUpload
                {...defineField('inbound.credential')}
                disabled={ busy || inboundFreezed }
                data={ {
                  meta: JSON.stringify({
                    flow: 'dais-reimbursement',
                    type: 'trip_ticket',
                    user: this.$store.getters['user/user'],
                  })
                } }
                beforeUpload={ this.checkImageFormat }
              >
                <div class="upload-hint">
                  <i class="el-icon-plus" />
                  <p class="hint">长途车票照片<br/>火车票照片<br/>机票行程单截图</p>
                </div>
              </MultipleImageUpload>
            </el-form-item>

            { renderUpperboundWarning() }
            { renderRejectionNote('inbound') }

            <div class="center-children">
              { renderTripState('inbound') }
              { inboundFreezed
                ? []
                : <el-button
                    size="small"
                    type="primary"
                    loading={ busy }
                    onClick={ this.submitInbound }
                  > 提交 </el-button>
              }
            </div>
          </el-form>

          <el-form
            class="trip outbound"
            label-width="72px"
            label-position="right"
            size="medium"
            model={ model && model.outbound }
            disabled={ busy || outboundFreezed }
            show-message={ false }
          >
            <h5 class="trip-title"> <icon name="sign-out" /> 回程 </h5>
            <el-form-item label="目的地" prop="region">
              <ProvinceCity {...defineField('outbound.region')} />
            </el-form-item>
            <el-form-item label="金额" prop="cost">
              <el-input-number step={10} min={0} precision={2} controls={false} {...defineField('outbound.cost')} />
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input {...defineField('outbound.note')} />
            </el-form-item>
            <el-form-item class="top-label" label="凭证" prop="credential">
              <MultipleImageUpload
                {...defineField('outbound.credential')}
                disabled={ busy || outboundFreezed }
                data={ {
                  meta: JSON.stringify({
                    flow: 'dais-reimbursement',
                    type: 'trip_ticket',
                    user: this.$store.getters['user/user'],
                  })
                } }
                beforeUpload={ this.checkImageFormat }
              >
                <div class="upload-hint">
                  <i class="el-icon-plus" />
                  <p class="hint">长途车票照片<br/>火车票照片<br/>机票行程单截图</p>
                </div>
              </MultipleImageUpload>
            </el-form-item>

            { renderUpperboundWarning() }
            { renderRejectionNote('outbound') }

            <div class="center-children">
              { renderTripState('outbound') }
              { outboundFreezed
                ? []
                : <el-button
                    size="small"
                    type="primary"
                    loading={ busy }
                    onClick={ this.submitOutbound }
                  > 提交 </el-button>
              }
            </div>
          </el-form>

        </div>

      </div>
    )
  },
  created() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.reimbursement
  padding-bottom: 3em
h4
  text-align: center
h5
  flex-horz: center center
  svg
    margin-right: .5ch
.trip-wrapper
  flex-horz: center flex-start
.trip-title
  text-align: center
.hint
  text-align: center
  color: #909399
  font-size: 80%
.basic-info
  max-width: 45ch
  margin: 0 auto
  .el-input, .el-cascader
    width: 30ch
.trip
  width: 390px
  .el-input, .el-cascader, .el-input-number
    width: 300px
.center-children
  text-align: center
.el-tag
  margin: 0 2ch
.el-input-number /deep/ input
  text-align: left
.upload-hint
  line-height: 1rem
  width: 100%
  height: 100%
  flex-vert: center center
  i
    margin-bottom: .5em
.el-form /deep/ .el-form-item
  margin-bottom: 1em
.el-alert
  width: 22ch
  padding: 4px 8px 4px 16px
  margin: .5em auto
  word-break: break-word
</style>

