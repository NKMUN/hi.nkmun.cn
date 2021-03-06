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
        :session="this.representative ? this.representative.session.id : ''"
        ref="form"
      />

      <template v-if="showReviewControls">
        <div class="controls">
          <el-button
            type="primary"
            :loading="busy"
            @click="update"
            icon="el-icon-check"
          > 保存 </el-button>
        </div>
        <hr>
      </template>

      <div class="avatar">
        <h4 v-if="showReviewControls">
          审核 - 代表照片
          <el-tag v-if="representative.avatar_approval === true" type="success"> 已通过 </el-tag>
          <el-tag v-if="representative.avatar_approval === false" type="danger"> 待复核 </el-tag>
          <el-tag v-if="representative.avatar_approval !== false && representative.avatar_approval !== true" type="info"> 待审核 </el-tag>
        </h4>

        <template v-if="!showReviewControls">
          <h4>代表照片</h4>
          <p class="hint" style="text-align: center; margin: 1em 0">请上传一张清晰的正面照片，这张照片会印制在代表牌上。</p>
        </template>

        <AvatarUpload
          class="avatar-upload"
          :value="representative && representative.avatar_image"
          @change="setAvatarImage"
          :disabled="busy || (representative && representative.withdraw)"
          action="/api/images/"
          :data="{
            meta: JSON.stringify({
              flow: 'representative-info',
              type: 'avatar-image'
            })
          }"
        />
      </div>

      <div class="controls avatar-review" v-if="showReviewControls">
        <span class="one-line-input" style="margin-right: 2ch">
          <span>审核备注：</span>
          <el-input
            size="small"
            :value="representative && representative.avatar_approval_note"
            @input="setAvatarApprovalNote"
            style="width: 30ch"
            placeholder="审核备注"
          />
        </span>
        <el-button-group>
          <el-button
            type="danger"
            :disabled="busy || representative.avatar_approval === false"
            @click="rejectAvatar"
            size="small"
          > 不通过 </el-button>
          <el-button
            type="success"
            :disabled="busy || representative.avatar_approval === true"
            @click="approveAvatar"
            size="small"
          > 通过 </el-button>
        </el-button-group>
      </div>

      <div class="disclaimer">
        <h4 v-if="showReviewControls">
          审核 - 权责声明
            <el-tag v-if="representative.disclaimer_approval === true" type="success"> 已通过 </el-tag>
            <el-tag v-if="representative.disclaimer_approval === false" type="danger"> 待复核 </el-tag>
            <el-tag v-if="representative.disclaimer_approval !== false && representative.disclaimer_approval !== true" type="info"> 待审核 </el-tag>
        </h4>

        <template v-if="!showReviewControls">
          <h4>权责声明</h4>
          <p style="text-align: center; margin: 1em 0">
            <a href="https://nkmun.cn/file/NKMUNC-%E6%9D%83%E8%B4%A3%E5%A3%B0%E6%98%8E.pdf" target="_blank" download="NKMUNC-权责声明.pdf">权责声明下载</a>
          </p>
          <p class="hint" style="text-align: center; margin: 1em 0">请完整打印权责声明书并与监护人详阅，在最后一页完成签字并拍照上传该页，照片要求字迹清晰。</p>
        </template>

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

      <div class="controls disclaimer-review" v-if="showReviewControls">
        <span class="one-line-input" style="margin-right: 2ch">
          <span>审核备注：</span>
          <el-input
            size="small"
            :value="representative && representative.disclaimer_approval_note"
            @input="setDisclaimerApprovalNote"
            style="width: 30ch"
            placeholder="审核备注"
          />
        </span>
        <el-button-group>
          <el-button
            type="danger"
            :disabled="busy || representative.disclaimer_approval === false"
            @click="rejectDisclaimer"
            size="small"
          > 不通过 </el-button>
          <el-button
            type="success"
            :disabled="busy || representative.disclaimer_approval === true"
            @click="approveDisclaimer"
            size="small"
          > 通过 </el-button>
        </el-button-group>
      </div>

      <div v-if="!showReviewControls" class="controls">
        <el-button
          type="primary"
          :loading="busy"
          @click="update"
          icon="el-icon-check"
        > 保存 </el-button>
      </div>

    </template>
  </div>
</template>

<script>
import RepresentativeInfo from '../../form/Representative'
import ImageUpload from '../../form/ImageUpload'
import AvatarUpload from '../../form/AvatarUpload'
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
    AvatarUpload,
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
    showReviewControls() {
      return hasAccess(this.$store.getters['user/access'], 'staff')
    },
  },
  data: () => ({
    busy: false,
    loading: true,
    representative: null,
    dirty: false,
  }),
  methods: {
    notifyError(e, title='操作失败') {
      const message = e.res ? `${e.res.status} / ${e.res.body.text}` : e.message
      this.$notify({
        type: 'error',
        title,
        message: message,
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
        } catch(e) {
          this.notifyError(e, '获取失败')
          this.representative = null
        } finally {
          this.loading = false
          this.$nextTick(_ => {
            if (this.$refs.form && this.$refs.form.clearValidate)
              this.$refs.form.clearValidate()
          })
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
    async setAvatarImage(value) {
      try {
        const respBody = await this.$agent
          .patch('/api/schools/'+this.school+'/representatives/'+this.id)
          .send({ avatar_image: value })
          .body()
        this.representative = {
          ... (this.representative || {}),
          avatar_image: respBody.avatar_image
        }
      } catch(e) {
        this.notifyError(e, '更新代表照片失败')
      }
    },
    setAvatarApprovalNote(value) {
      this.representative = {
        ... (this.representative || {}),
        avatar_approval_note: value
      }
    },
    async approveAvatar() {
      this.busy = true
      try {
        this.representative = await this.$agent
          .patch('/api/schools/'+this.school+'/representatives/'+this.id)
          .send({ avatar_approval: true })
          .body()
        this.$notify({
          type: 'success',
          title: '更新成功',
          message: '代表照片审核「通过」 '+this.representative.session.name,
          duration: 5000
        })
        this.$emit('update',this.representative)
      } catch(e) {
        this.notifyError(e, '更新代表照片审核状态失败')
      } finally {
        this.busy = false
      }
    },
    async rejectAvatar() {
      this.busy = true
      try {
        this.representative = await this.$agent
          .patch('/api/schools/'+this.school+'/representatives/'+this.id)
          .send({ avatar_approval: false, avatar_approval_note: this.representative.avatar_approval_note })
          .body()
        this.$notify({
          type: 'success',
          title: '更新成功',
          message: '代表照片审核「未通过」 '+this.representative.session.name,
          duration: 5000
        })
        this.$emit('update',this.representative)
      } catch(e) {
        this.notifyError(e, '更新代表照片审核状态失败')
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
.controls, ul.hint
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
.disclaimer, .disclaimer-review, .avatar, .avatar-review
  text-align: center
.disclaimer, .avatar
  h4
    margin-top: 2em
.image-upload, .avatar-upload
  margin: 0 auto
.one-line-input
  .el-input
    display: inline-block
    width: 20ch
    margin: 0em 0
</style>
