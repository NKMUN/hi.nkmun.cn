<template>
  <div class="dais-user-info" v-loading="busy">

    <section>
      <h4>个人信息</h4>

      <el-form
        class="form small"
        :label-width="labelWidth"
      >
        <el-form-item label="职能"> {{ dais && dais.role }} </el-form-item>
        <el-form-item label="学校"> {{ dais && dais.school }} </el-form-item>
        <el-form-item label="姓名"> {{ dais && dais.contact.name }} </el-form-item>
        <el-form-item label="性别"> {{ dais && dais.contact.gender | genderText }} </el-form-item>
        <el-form-item label="手机"> {{ dais && dais.contact.phone }} </el-form-item>
        <el-form-item label="邮箱"> {{ dais && dais.contact.email }} </el-form-item>
        <el-form-item label="QQ号"> {{ dais && dais.contact.qq }} </el-form-item>
        <el-form-item label="照片" required>
          <ImageUpload
            :value="dais && dais.photoId"
            @uploaded="updateImage"
            class="upload"
            action="/api/images/"
            image-dimension="240px"
            preview-size="mini"
          />
        </el-form-item>
      </el-form>

    </section>

    <section>
      <h4>身份信息</h4>
      <IdentificationForm
        ref="identification"
        :value="dais && dais.identification"
        @input="val => dais.identification = val"
        class="form small"
        :label-width="labelWidth"
        :disabled="busy"
      />
    </section>

    <section>
      <h4>{{ isAdult ? '紧急联系人' : '监护人' }}</h4>
      <GuardianForm
        ref="guardian"
        :value="dais && dais.guardian"
        @input="val => dais.guardian = val"
        class="form small"
        :label-width="labelWidth"
        :disabled="busy"
      />
      <IdentificationForm
        ref="guardian-identification"
        :value="dais && dais.guardian_identification"
        @input="val => dais.guardian_identification = val"
        class="form small"
        :label-width="labelWidth"
        :disabled="busy"
      />
    </section>

    <section>
      <h4>其它</h4>

      <div class="controls">
        <el-checkbox v-model="isForeign">外地组委请勾选</el-checkbox>
      </div>

      <p class="hint red">会期外，协议酒店住宿费用： 210/人/天 或 420/间/天</p>

      <el-form class="form large" label-width="140px" required>
        <el-form-item label="酒店入住/退房时间">
          <el-date-picker
            :value="dais ? [dais.checkInDate, dais.checkOutDate] : null"
            @input="updateHotelDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            placeholder="请选择"
            :default-value="datePickerDefaultValue"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="抵宁/离宁日期" v-show="isForeign">
          <el-date-picker
            :value="dais ? [dais.arriveDate, dais.departDate] : null"
            @input="updateArriveDepartDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            placeholder="请选择"
            :default-value="datePickerDefaultValue"
            :picker-options="pickerOptions"
          />
        </el-form-item>
      </el-form>

      <el-form class="form large" label-width="48px">
        <el-form-item label="备注">
          <el-input
            :disabled="busy"
            :value="dais && dais.comment"
            @input="val => dais.comment = val"
          />
        </el-form-item>
      </el-form>
    </section>

    <el-button
      type="success"
      icon="edit"
      @click="update"
      size="large"
      :busy="busy"
    > 更新 </el-button>

  </div>
</template>

<script>
import ImageUpload from '@/components/form/ImageUpload'
import GuardianForm from '@/components/form/Guardian'
import IdentificationForm from '@/components/form/Identification'
import genderText from '@/lib/gender-text'

export default {
  name: 'dais-user-info',
  components: {
    ImageUpload,
    GuardianForm,
    IdentificationForm
  },
  data() {
    return {
      busy: false,
      dais: null,
      isForeign: false
    }
  },
  computed: {
    imageUrl() {
      return this.dais ? `/api/images/${this.dais.photoId}?size=small&format=jpg` : ''
    },
    forms() {
      return [
        'identification',
        'guardian',
        'guardian-identification'
      ]
    },
    labelWidth() {
      return "84px"
    },
    isAdult() {
      const idNumber = (this.dais && this.dais.identification && this.dais.identification.number) || ''
      const birthdayStr = idNumber.slice(6, 14)
      if (birthdayStr.length === 8) {
        const YYYY = birthdayStr.slice(0, 4)
        const MM = birthdayStr.slice(4, 6)
        const DD = birthdayStr.slice(6, 8)
        const birthday = new Date(YYYY, MM, DD)
        const today = new Date()
        return today - birthday >= 18 * 365 * 24 * 60 * 60 * 1000    // ignore leap year
      } else {
        return null
      }
    },
    datePickerDefaultValue() {
      return this.$store.getters['config/conferenceStartDate']
    },
    pickerOptions() {
      return {
        disabledDate(v) {
          return v < new Date() -  24*60*60*1000
        }
      }
    },
  },
  methods: {
    updateHotelDate(val) {
      if (this.dais) {
        if (val && val.length === 2) {
          this.dais.checkInDate = val[0]
          this.dais.checkOutDate = val[1]
        } else {
          this.dais.checkInDate = null
          this.dais.checkOutDate = null
        }
      }
    },
    updateArriveDepartDate(val) {
      if (this.dais) {
        if (val && val.length === 2) {
          this.dais.arriveDate = val[0]
          this.dais.departDate = val[1]
        } else {
          this.dais.arriveDate = null
          this.dais.departDate = null
        }
      }
    },
    async fetch() {
      this.busy = true
      this.dais = await this.$agent.get('/api/daises/~').body()
      this.isForeign = Boolean(this.dais.arriveDate || this.dais.departDate)
      this.busy = false
    },
    async updateImage(photoId) {
      this.dais = await this.$agent.patch('/api/daises/~').send({ photoId }).body()
      this.$message({
        type: 'success',
        message: '照片已更新'
      })
    },
    async validate() {
      let results = await Promise.all(
        this.forms.map( ref => this.$refs[ref].validate() ),
        () => new Promise(resolve => {
          const dais = this.dais
          // validate arrive / depart / checkIn / checkOut
          return dais && dais.checkInDate && dais.checkOutDate && (
            this.isForeign
            ? dais.arriveDate
            : dais.departDate
          )
        })
      )
      return results.reduce( (a, v) => a && v )
    },
    async update() {
      if ( ! await this.validate() ) {
        this.$message({
          type: 'warning',
          message: '不能提交，请修正红色标出的项目'
        })
        return
      }

      this.busy = true
      try {
        await this.$agent.patch('/api/daises/~').send({
          identification: this.dais.identification,
          guardian: this.dais.guardian,
          guardian_identification: this.dais.guardian_identification,
          comment: this.dais.comment,
          checkInDate: this.dais.checkInDate,
          checkOutDate: this.dais.checkOutDate,
          ...(this.isForeign
            ? { arriveDate: this.dais.arriveDate, departDate: this.dais.departDate }
            : { arriveDate: null, departDate: null }
          )
        })
        this.$message({
          type: 'success',
          message: '个人信息已更新'
        })
      } catch(e) {
        this.$notify({
          type: 'warning',
          title: '更新失败',
          message: e.message
        })
      } finally {
        this.busy = false
      }
    }
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
.dais-user-info
  padding-bottom: 3em
h4
  text-align: center
.upload
  margin: 0 auto
.form
  margin: 0 auto
  &.small
    max-width: 36ch
  &.large
    max-width: 64ch
.el-button
  display: block
  margin: 0 auto
  text-align: center
.controls
  margin: 1em auto
  text-align: center
.hint
  font-size: 80%
  text-align: center
  &.red
    color: red
</style>