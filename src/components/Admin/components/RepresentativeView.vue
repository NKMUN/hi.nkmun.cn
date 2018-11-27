<template>
  <div class="reviewer" v-loading.lock.body="id && (!representative || loading)">

    <template v-if="id && representative">

      <ul class="hint">
        <li>非大陆地区手机号：请加上国家前缀<br/>如：+8860933000000</li>
        <li>如使用其它证件，请在备注中说明证件类型</li>
      </ul>

      <div class="controls" v-if="showWithdraw">
        <el-checkbox
          :value="representative && representative.withdraw"
          @input="setWithdraw"
          :disabled="!canWithdraw"
        > <strong>该代表放弃参会</strong> </el-checkbox>
      </div>

      <RepresentativeInfo
        v-model="representativeModel"
        @change="dirty = true"
        class="representative-info"
        :disabled="busy || (representative && representative.withdraw)"
        :leaderEditable="leaderEditable && canBeLeader"
        :isAdult="isAdult"
        :session="this.representative ? this.representative.session.id : ''"
        ref="form"
      />

      <div class="disclaimer">
        <h4>权责声明</h4>
        <ImageUpload
          class="image-upload"
          action="/api/images/"
          :value="representative && representative.disclaimer_image"
          @change="setDisclaimerImage"
          :disabled="busy || (representative && representative.withdraw)"
          :data="{
            meta: JSON.stringify({
              flow: 'representative-info',
              type: 'disclaimer-image',
              user: user
            })
          }"
        />
      </div>

      <div class="controls">
        <el-button
          type="primary"
          :loading="busy"
          @click="update"
        > 保存 </el-button>
      </div>

      <div class="controls disclaimer-review" v-if="showDisclaimerReviewControls">
        <h4>
          权责声明审核
          <el-tag v-if="representative.disclaimer_approval === true" type="success"> 已通过 </el-tag>
          <el-tag v-if="representative.disclaimer_approval === false" type="danger"> 待复核 </el-tag>
          <el-tag v-if="representative.disclaimer_approval !== false && representative.disclaimer_approval !== true" type="info"> 待审核 </el-tag>
        </h4>
        <div class="one-line-input">
          <span>审核备注：</span>
          <el-input
            size="small"
            :value="representative && representative.disclaimer_approval_note"
            @input="setDisclaimerApprovalNote"
            placeholder="审核备注"
          />
        </div>
        <el-button-group>
          <el-button
            type="danger"
            :disabled="busy || representative.disclaimer_approval === false"
            @click="rejectDisclaimer"
          > 不通过 </el-button>
          <el-button
            type="success"
            :disabled="busy || representative.disclaimer_approval === true"
            @click="approveDisclaimer"
          > 通过 </el-button>
        </el-button-group>
      </div>

    </template>
  </div>
</template>

<script>
import RepresentativeInfo from '../../form/Representative'
import ImageUpload from '../../form/ImageUpload'
import { mapGetters } from 'vuex'
import { hasAccess } from '@/lib/access'

const pluck = (obj, ...fields) => {
  if (!obj)
    return {}
  let ret = {}
  fields.forEach( key => ret[key] = obj[key] )
  return ret
}

const pluckRepresentativeFields = (r) => pluck(
  r,
  'contact',
  'graduation_year',
  'identification',
  'is_leader',
  'guardian',
  'guardian_identification',
  'alt_guardian',
  'comment'
)

export default {
  name: 'representative-view',
  components: {
    RepresentativeInfo,
    ImageUpload,
  },
  props: {
    showWithdraw: { type: Boolean, default: false },
    id: { type: String, default: null },
    school: { type: String, default: null },
    leaderEditable: { type: Boolean, default: true },
  },
  computed: {
    ... mapGetters({
      user: 'user/user'
    }),
    isAdult() {
      // TODO: make it configurable on server, either:
      // 1. make teacher/supervisor a reserved (internal) session
      // 2. add isAdult flag to session
      return (this.representative && this.representative.session)
          && ( this.representative.session.id === 'teacher'
            || this.representative.session.id === 'supervisor'
            || this.representative.session.id === '_supervisor'
          )
    },
    representativeModel: {
      get() {
        return pluckRepresentativeFields(this.representative)
      },
      set(val) {
        this.representative = {
          ... (this.representative || {}),
          ... val
        }
      }
    },
    canWithdraw() {
      const { session, is_leader } = this.representative || {}
      return session && session.id !== '_leader_nr' && !is_leader
    },
    canBeLeader() {
      const { withdraw, is_leader } = this.representative || {}
      return !withdraw && is_leader !== null
    },
    showDisclaimerReviewControls() {
      return hasAccess(this.$store.getters['user/access'], 'staff')
    }
  },
  data: () => ({
    busy: false,
    loading: true,
    representative: null,
    dirty: false,
  }),
  methods: {
    notifyError(e, title='操作失败') {
      this.$notify({
        type: 'error',
        title,
        message: e.message,
        duration: 0
      })
    },
    async fetch() {
      if (this.school && this.id) {
        this.loading = true
        try {
          this.representative = await this.$agent
            .get('/api/schools/'+this.school+'/representatives/'+this.id)
            .body()
          if (this.$refs.form)
            this.$refs.form.reset()
        } catch(e) {
          this.notifyError(e, '获取失败')
          this.representative = null
        } finally {
          this.loading = false
        }
      } else {
        this.representative = null
        this.seat = null
      }
    },
    async update(silent=false) {
      if ( ! this.dirty )
        return true
      if ( ! await this.$refs.form.validate() ) {
        this.$notify({
          type: 'warning',
          title: '信息有错误',
          message: '请修正红色标出的错误',
          duration: 5000
        })
        return false
      }
      let result = false
      try {
        this.dirty = false
        this.representative = await this.$agent
          .patch('/api/schools/'+this.school+'/representatives/'+this.id)
          .send( this.representativeModel )
          .body()
        if (!silent) {
          this.$notify({
            type: 'success',
            title: '更新成功',
            message: '已更新 '+this.representative.session.name,
            duration: 5000
          })
        }
        result = true
      } catch(e) {
        this.notifyError(e, '更新失败')
      } finally {
        this.busy = false
      }
      return result
    },
    async setWithdraw(value) {
      this.busy = true
      try {
        this.representative = await this.$agent
          .patch('/api/schools/'+this.school+'/representatives/'+this.id)
          .send({ withdraw: value })
          .body()
        let name = this.representative && this.representative.contact && this.representative.contact.name || this.representative.session.name || ''
        this.$notify({
          type: 'success',
          title: '更新成功',
          message: '已设置 ' + name + '：' + (value ? '放弃参会' : '参会'),
          duration: 5000
        })
      } catch(e) {
        this.notifyError(e, '更新失败')
      } finally {
        this.busy = false
      }
    },
    async setDisclaimerImage(value) {
      try {
        const respBody = await this.$agent
          .patch('/api/schools/'+this.school+'/representatives/'+this.id)
          .send({ disclaimer_image: value })
          .body()
        this.representative = {
          ... (this.representative || {}),
          disclaimer_image: respBody.disclaimer_image
        }
      } catch(e) {
        this.notifyError(e, '更新权责声明失败')
      }
    },
    setDisclaimerApprovalNote(value) {
      this.representative = {
        ... (this.representative || {}),
        disclaimer_approval_note: value
      }
    },
    async approveDisclaimer() {
      this.busy = true
      try {
        this.representative = await this.$agent
          .patch('/api/schools/'+this.school+'/representatives/'+this.id)
          .send({ disclaimer_approval: true })
          .body()
        this.$notify({
          type: 'success',
          title: '更新成功',
          message: '权责声明审核「通过」 '+this.representative.session.name,
          duration: 5000
        })
        this.$emit('update',this.representative)
      } catch(e) {
        this.notifyError(e, '更新权责声明审核状态失败')
      } finally {
        this.busy = false
      }
    },
    async rejectDisclaimer() {
      this.busy = true
      try {
        this.representative = await this.$agent
          .patch('/api/schools/'+this.school+'/representatives/'+this.id)
          .send({ disclaimer_approval: false, disclaimer_approval_note: this.representative.disclaimer_approval_note })
          .body()
        this.$notify({
          type: 'success',
          title: '更新成功',
          message: '权责声明审核「未通过」 '+this.representative.session.name,
          duration: 5000
        })
        this.$emit('update',this.representative)
      } catch(e) {
        this.notifyError(e, '更新权责声明审核状态失败')
      } finally {
        this.busy = false
      }
    },
  },
  mounted() {
    return this.fetch()
  },
  watch: {
    id() {
      if (this.id) {
        this.$nextTick( () => this.fetch() )
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
.controls, .hint
  display: table
  margin: 1em auto
.hint
  text-align: left
  font-size: 90%
  color: #8492A6
  li
    margin: .25em 0
  b
    font-weight: normal
    text-decoration: underline
.disclaimer, .disclaimer-review
  text-align: center
.image-upload
  margin: 0 auto
.one-line-input
  .el-input
    display: inline-block
    width: 20ch
    margin: 1em 0
</style>
