<template>
  <div class="confirm">

    <div class="note">
      <h4 v-if="!confirmed">请确认参会信息。如有问题，请联系组委。</h4>
      <h4 v-if="confirmed">信息已确认</h4>
    </div>

    <div class="validation-result" v-if="validationResult && validationResult.length" style="margin-bottom: 1.5em">
      <el-alert
        title="代表信息有错误"
        description="请返回代表信息页面修正以下问题："
        type="error"
        show-icon
        :closable="false"
      />
      <ul style="margin-top: 1em; color: #e6a23c">
        <li v-for="(problem, idx) in validationResult" :key="idx">{{ problem }}</li>
      </ul>
    </div>

    <RepresentativeTable @validated="handleValidated"/>

    <h4>酒店预订</h4>
    <ReservationControl readonly :school="id" />

    <el-button
      class="confirm-button"
      v-if="!confirmed"
      icon="el-icon-check"
      size="large"
      type="danger"
      :disabled="!canConfirm"
      :loading="busy"
      @click="confirm"
    > 确认 </el-button>

    <p v-if="confirmed">
    </p>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ReservationControl from '@/components/Admin/components/ReservationControl'
import RepresentativeTable from './components/RepresentativeTable'

export default {
  name: 'confirm',
  components: {
    ReservationControl,
    RepresentativeTable,
  },
  computed: {
    ...mapGetters({
      id: 'user/school',
      stage: 'school/stage',
    }),
    canConfirm() {
      return this.stage === '3.confirm'
          && this.validationResult
          && this.validationResult.length === 0
    },
    confirmed() {
      return this.stage
          && Number(this.stage[0]) > '3'
    }
  },
  data: () => ({
    busy: false,
    validationResult: null
  }),
  methods: {
    async confirm() {
      if ( ! await (
        this.$serious('请检查以上信息是否正确，确认后不能再修改！\n如因信息错误导致问题，后果自负。', '我确认信息正确无误')
      ) ) {
        return
      }
      try {
        await this.$agent
          .post('/api/schools/'+this.id+'/seat')
          .send({ confirmAttend: 1 })
        this.$store.commit('school/stage', '9.complete')
        this.$notify({
          type: 'success',
          title: '信息确认成功'
        })
      } catch(e) {
        this.$notify({
          type: 'success',
          title: '信息已确认',
          duration: 0
        })
      }
    },
    handleValidated(result) {
      this.validationResult = result
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.confirm
  flex-vert: flex-start center
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
.confirm-button
  margin-top: 2em
</style>
