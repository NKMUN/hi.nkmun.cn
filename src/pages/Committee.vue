<template>
  <div class="committee-reg">
    <Banner />

    <div class="layout">
      <CommitteeMember v-model="data" class="form" ref="committee" />

      <div class="controls">
        <el-button
          type="primary"
          icon="check"
          @click="submit"
        > 提交 </el-button>
      </div>
    </div>

    <Copyright />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutCenter from 'components/LayoutCenter'
import Banner from 'components/Banner'
import Copyright from 'components/Copyright'
import CommitteeMember from 'components/form/CommitteeMember'

export default {
  components: {
    Banner,
    Copyright,
    CommitteeMember,
    LayoutCenter
  },
  data() {
    return {
      data: null
    }
  },
  methods: {
    async submit() {
      if (await this.$refs.committee.validate()) {
        try {
          let {
            ok,
            body
          } = await this.$agent.post('/api/committees/')
                    .send(this.data)
          if (ok) {
            await this.$msgbox({
              type: 'success',
              title: '提交成功',
              message: '点击确定返回首页',
              showCancelButton: false,
              showConfirmButton: true
            })
            this.$router.replace('/')
          }
        } catch(e) {
          this.$notify({
            type: 'error',
            title: '提交失败',
            message: e.message
          })
        }
      }
    }
  },
}

</script>

<style lang="stylus" scoped>
.layout
  flex-grow: 1
  padding-bottom: 3em
.form
  min-width: 40ch
  margin: 0 auto
  & *
    flex-shrink: 0
.controls
  text-align: center
</style>
