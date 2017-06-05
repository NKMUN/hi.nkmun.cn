<template>
  <div class="confirm">

    <div class="note">
      <ul>
        <li v-if="!confirmed">请确认参会信息。如有问题，请联系组委。</li>
        <li v-if="confirmed">信息已确认</li>
      </ul>
    </div>

    <div class="validation-result" v-if="validationResult && validationResult.length">
      <el-alert
        title="代表信息有错误"
        description="请返回代表信息页面修正以下问题："
        type="error"
        show-icon
        :closable="false"
      />
      <ul>
        <li v-for="problem in validationResult">{{ problem }}</li>
      </ul>
    </div>

    <RepresentativeTable @validated="handleValidated"/>

    <h4>酒店预订</h4>
    <ReservationView />

    <el-button
      v-if="!confirmed"
      size="large"
      type="primary"
      :disabled="!canConfirm"
      :loading="busy"
      @click="confirm"
    > 确认 </el-button>

    <p v-if="confirmed">
    </p>

    <SeriousConfirm ref="serious" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from 'store/index'
import SeriousConfirm from '../SeriousConfirm'
import ReservationView from './components/ReservationView'
import RepresentativeTable from './components/RepresentativeTable'

export default {
  name: 'confirm',
  components: {
    SeriousConfirm,
    ReservationView,
    RepresentativeTable,
  },
  computed: {
    ...mapGetters({
      id: 'user/school',
      authorization: 'user/authorization',
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
        this.$refs.serious.confirm('请检查以上信息是否正确，确认后不能再修改！\n如因信息错误导致问题，后果自负。', '我确认信息正确无误')
      ) ) {
        return
      }
      try {
        let {
          body
        } = await this.$agent.post('/api/schools/'+this.id+'/seat')
                  .send({ confirmAttend: 1 })
                  .set( ... this.authorization )
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
</style>
