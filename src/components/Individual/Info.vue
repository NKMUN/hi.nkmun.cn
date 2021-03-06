<template>
  <div class="representative-form" v-loading="!representative">
    <template v-if="representative">
      <section>
        <h4>个人信息</h4>

        <form class="el-form form small">
          <div class="el-form-item">
            <label for="name" class="el-form-item__label" :style="{width: labelWidth}">会场</label>
            <div class="el-form-item__content" :style="{marginLeft: labelWidth, padding: '0 10px'}">
              {{ SESSION(representative.session).name }}
            </div>
          </div>
          <div class="el-form-item">
            <label for="name" class="el-form-item__label" :style="{width: labelWidth}">姓名</label>
            <div class="el-form-item__content" :style="{marginLeft: labelWidth, padding: '0 10px'}">{{ representative.contact.name }}</div>
          </div>
          <div class="el-form-item">
            <label for="name" class="el-form-item__label" :style="{width: labelWidth}">性别</label>
            <div class="el-form-item__content" :style="{marginLeft: labelWidth, padding: '0 10px'}">{{ representative.contact.gender | genderText }}</div>
          </div>
          <div class="el-form-item">
            <label for="name" class="el-form-item__label" :style="{width: labelWidth}">手机</label>
            <div class="el-form-item__content" :style="{marginLeft: labelWidth, padding: '0 10px'}">{{ representative.contact.phone }}</div>
          </div>
          <div class="el-form-item">
            <label for="name" class="el-form-item__label" :style="{width: labelWidth}">QQ</label>
            <div class="el-form-item__content" :style="{marginLeft: labelWidth, padding: '0 10px'}">{{ representative.contact.qq }}</div>
          </div>
          <div class="el-form-item">
            <label for="name" class="el-form-item__label" :style="{width: labelWidth}">邮箱</label>
            <div class="el-form-item__content" :style="{marginLeft: labelWidth, padding: '0 10px'}">{{ representative.contact.email }}</div>
          </div>

          <p style="text-align: center; margin: 1em 0">代表牌照片</p>
          <AvatarUpload
            :class="{
              'avatar-upload': true,
              'is-error': avatarImageError
            }"
            :value="representative && representative.avatar_image"
            @change="setAvatarImage"
            :disabled="representative.confirmed || busy"
            action="/api/images/"
            :data="{
              meta: JSON.stringify({
                flow: 'individual-update-info',
                type: 'avatar-image'
              })
            }"
          />
          <el-alert v-if="avatarImageError" type="error" title="请上传代表牌照片" :closable="false" />
        </form>

        <GraduationForm
          ref="graduation_year"
          v-model="representative.graduation_year"
          class="form small"
          :label-width="labelWidth"
          :disabled="representative.confirmed || busy"
        />

        <IdentificationForm
          ref="identification"
          v-model="representative.identification"
          class="form small"
          :label-width="labelWidth"
          :disabled="representative.confirmed || busy"
        />
      </section>

      <section>
        <h4>第一监护人</h4>
        <GuardianForm
          ref="guardian"
          v-model="representative.guardian"
          class="form small"
          :label-width="labelWidth"
          :disabled="representative.confirmed || busy"
        />
        <IdentificationForm
          ref="guardian_identification"
          v-model="representative.guardian_identification"
          class="form small"
          :label-width="labelWidth"
          :disabled="representative.confirmed || busy"
        />

        <h4>第二监护人</h4>
        <GuardianForm
          ref="alt_guardian"
          v-model="representative.alt_guardian"
          class="form small"
          :label-width="labelWidth"
          :disabled="representative.confirmed || busy"
        />
      </section>

      <div class="disclaimer">
        <h4>权责声明</h4>
        <p style="text-align: center; margin: 1em 0">
          <a href="https://nkmun.cn/file/NKMUNC-%E6%9D%83%E8%B4%A3%E5%A3%B0%E6%98%8E.pdf" target="_blank" download="NKMUNC-权责声明.pdf">权责声明下载</a>
        </p>
        <p style="text-align: center; margin: 1em 0">请完整打印权责声明书并与监护人详阅，在最后一页完成签字并拍照上传该页，照片要求字迹清晰。</p>
        <ImageUpload
          :class="{
            'image-upload': true,
            'is-error': disclaimerImageError
          }"
          action="/api/images/"
          :value="representative && representative.disclaimer_image"
          @change="setDisclaimerImage"
          :disabled="representative.confirmed || busy"
          :data="{
            meta: JSON.stringify({
              flow: 'representative-info',
              type: 'disclaimer-image',
              user: user
            })
          }"
        />
        <el-alert v-if="disclaimerImageError" type="error" title="请上传权责声明签名页" :closable="false" />
      </div>

      <section>
        <h4>其他</h4>
        <el-form
          class="form large"
          :label-width="labelWidth"
        >
          <el-form-item label="收货地址">
            <el-input :disabled="representative.confirmed" v-model="representative.comment" autocomplete="off" />
          </el-form-item>
        </el-form>
      </section>

      <div class="center" v-if="!representative.confirmed">
        <el-button
          type="success"
          icon="el-icon-edit"
          @click="update"
        > 更新 </el-button>
        <el-button
          v-if="!representative.confirmed"
          type="danger"
          icon="el-icon-check"
          @click="confirm"
        > 确认信息 </el-button>
      </div>

      <p class="center" v-if="representative.confirmed"> 信息已确认 </p>
    </template>
  </div>
</template>

<script>
import genderText from '@/lib/gender-text'
import GraduationForm from '../form/Graduation'
import IdentificationForm from '../form/Identification'
import GuardianForm from '../form/Guardian'
import SessionUtils from '../../lib/session-utils'
import { mapGetters } from 'vuex'
import ImageUpload from '../form/ImageUpload'
import AvatarUpload from '../form/AvatarUpload'

export default {
  name: 'representative-form',
  components: {
    GraduationForm,
    IdentificationForm,
    GuardianForm,
    ImageUpload,
    AvatarUpload
  },
  mixins: [
    SessionUtils
  ],
  computed: {
    ...mapGetters({
      school: 'user/school',
      user: 'user/user'
    })
  },
  data: () => ({
    labelWidth: '108px',
    representative: null,
    busy: false,
    disclaimerImageError: false,
    avatarImageError: false,
  }),
  methods: {
    fetch() {
      this.busy = true
      return this.$agent.get(`/api/schools/${this.school}/individual`).then(
        resp => this.representative = resp.body,
        err => this.$message({
          type: 'error',
          message: err.message
        })
      ).then(
        _ => this.busy = false
      )
    },
    update() {
      return this.validate().then(
        valid => {
          if (!valid) return false
          this.busy = true
          return this.$agent
            .patch(`/api/schools/${this.school}/individual`)
            .send({
              graduation_year: this.representative.graduation_year,
              identification: this.representative.identification,
              guardian: this.representative.guardian,
              guardian_identification: this.representative.guardian_identification,
              alt_guardian: this.representative.alt_guardian,
              disclaimer_image: this.disclaimer_image,
              comment: this.representative.comment,
            })
            .then(
              resp => {
                this.busy = false
                this.representative = resp.body
                this.$message({
                  type: 'success',
                  message: '已更新'
                })
                return true
              },
              err => {
                this.busy = false
                this.$message({
                  type: 'error',
                  message: err.message
                })
                return false
              }
            )
        }
      )
    },
    setDisclaimerImage(value) {
      return this.$agent
        .patch(`/api/schools/${this.school}/individual`)
        .send({ disclaimer_image: value })
        .then(
          resp => {
            this.busy = false
            this.representative = {
              ...this.representative,
              disclaimer_image: resp.body.disclaimer_image
            }
            this.$message({
              type: 'success',
              message: '已更新权责声明'
            })
            this.validateDisclaimer()
            return true
          },
          err => {
            this.busy = false
            this.$message({
              type: 'error',
              message: '更新权责声明失败' + err.message
            })
            return false
          }
        )
    },
    setAvatarImage(value) {
      return this.$agent
        .patch(`/api/schools/${this.school}/individual`)
        .send({ avatar_image: value })
        .then(
          resp => {
            this.busy = false
            this.representative = {
              ...this.representative,
              avatar_image: resp.body.avatar_image
            }
            this.$message({
              type: 'success',
              message: '已更新照片'
            })
            this.validateAvatar()
            return true
          },
          err => {
            this.busy = false
            this.$message({
              type: 'error',
              message: '照片更新失败：' + err.res ? `${err.res.status} / ${err.res.text}` : err.message
            })
            return false
          }
        )
    },
    confirm() {
      this.$serious('请检查以上信息是否正确，确认后不能再修改！\n如因信息错误导致问题，后果自负。', '我确认信息正确无误').then(
        ok => ok ? this.update() : false
      ).then(
        ok => {
          if (!ok) return false
          this.busy = true
          return this.$agent.post(`/api/schools/${this.school}/individual`).send({ confirm: 1 }).then(
            resp => {
              this.representative = resp.body
              this.$message({
                type: 'success',
                message: '个人信息已确认'
              })
            },
            err => this.$message({
              type: 'error',
              message: err.message
            })
          ).then(
            this.busy = false
          )
        }
      )
    },
    validate() {
      const forms = ['graduation_year', 'identification', 'guardian', 'guardian_identification', 'alt_guardian']
      return Promise.all([
        ...forms.map(ref => this.$refs[ref].validate()),
        Promise.resolve(this.validateDisclaimer()),
        Promise.resolve(this.validateAvatar()),
      ]).then(results => results.reduce((a, v) => a && v ))
    },
    validateDisclaimer() {
      return !(this.disclaimerImageError = !(this.representative && this.representative.disclaimer_image))
    },
    validateAvatar() {
      return !(this.avatarImageError = !(this.representative && this.representative.avatar_image))
    },
  },
  mounted() {
    this.fetch()
  },
  filters: {
    genderText
  }
}
</script>

<style lang="stylus" scoped>
.representative-form
  align-self: stretch
  h4
    text-align: center
  .form
    margin: 0 auto
    &.small
      max-width: 36ch
    &.large
      max-width: 64ch
.center
  text-align: center
.image-upload
  margin: 0 auto
.avatar-upload
  margin: -0.5em auto 1em auto
.el-alert
  margin: 1em auto
  width: 20ch
  text-align: center
</style>
