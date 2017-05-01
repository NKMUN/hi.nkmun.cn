<template>
  <div class="reviewer" v-loading="id && (!representative || loading)">
    <template v-if="representative">

      <!-- TOOD: impl representative view -->
      <!-- should be a component that takes representativeModel as v-model -->
      <div class="representative-card"></div>

      <div class="controls">
        <el-button
          type="info"
          :loading="busy"
          @click="updateAndNext"
        > 保存 <i class="el-icon-arrow-right el-icon--right"> </el-button>
      </div>

    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'representative-view',
  components: {
  },
  props: {
    showWithdraw: { type: Boolean, default: false },
    id: { type: String, default: null },
    school: { type: String, default: null },
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
    representativeModel: {
      get() {
        const r = this.representative
        return {

        }
      },
      set(val) {
        this.representative = {
          ... this.representative,
          ... val
        }
      }
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
          let {
            body
          } = await this.$agent.get('/api/schools/'+this.school+'/representatives/'+this.id)
                               .set( ... this.authorization )
          this.representative = body
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
      if (!this.dirty)
        return true
      let result = false
      try {
        let {
          ok,
          status,
          body
        } = await this.$agent.patch('/api/schools/'+this.school+'/'+this.id)
                             .set( ... this.authorization )
                             .send( this.representativeModel )
        this.dirty = false
        this.representative = body
        this.representativeModel = getRepresentativeModel(this.representative)
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
    async updateAndNext() {
      if ( await this.update() ) {
        this.$nextTick( () => {
          this.$emit('next', this.id)
        })
      }
    },
  },
  mounted() {
    return this.fetch()
  },
  watch: {
    id(val) {
      this.$nextTick( () => this.fetch() )
    }
  }
}
</script>

<style lang="stylus" scoped>
.representative-card, .controls
  display: table
  margin: 1em auto
</style>
