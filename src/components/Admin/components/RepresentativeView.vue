<template>
  <div class="reviewer" v-loading.lock.body="id && (!representative || loading)">

    <template v-if="id && representative">

      <ul class="hint">
        <li>非大陆地区手机号：请加上国家前缀<br/>如：+8860933000000</li>
        <li>如使用其它证件，请在备注中说明证件类型</li>
      </ul>

      <RepresentativeInfo
        v-model="representativeModel"
        @change="dirty=true"
        class="representative-info"
        :disabled="busy"
        :leaderEditable="leaderEditable"
        :isAdult="isAdult"
        :session="this.representative ? this.representative.session.id : ''"
        ref="form"
      />

      <div class="controls" v-if="showWithdraw">
        <el-checkbox
          v-model="representative.withdraw"
          @input="setWithdraw"
          :disabled="!leaderEditable"
        > 该代表放弃参会 </el-checkbox>
      </div>

      <div class="controls">
        <el-button
          type="info"
          :loading="busy"
          @click="updateAndNext"
        > 保存并填写下一个 <i class="el-icon-arrow-right el-icon--right"/> </el-button>
      </div>

    </template>
  </div>
</template>

<script>
import RepresentativeInfo from '../../form/Representative'

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
  'guardian_identification'
)

export default {
  name: 'representative-view',
  components: {
    RepresentativeInfo
  },
  props: {
    showWithdraw: { type: Boolean, default: false },
    id: { type: String, default: null },
    school: { type: String, default: null },
    leaderEditable: { type: Boolean, default: true },
  },
  computed: {
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
          if (this.$refs.form)
            this.$refs.form.reset()
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
        let {
          ok,
          status,
          body
        } = await this.$agent.patch('/api/schools/'+this.school+'/representatives/'+this.id)
                             .send( this.representativeModel )
        this.dirty = false
        this.representative = body
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
        let {
          ok
        } = await this.$agent.patch('/api/schools/'+this.school+'/representatives/'+this.id)
                  .send({ withdraw: value })
        let name = this.representative && this.representative.contact && this.representative.contact.name || this.representative.session.name || ''
        this.$notify({
          type: 'success',
          title: '更新成功',
          message: '已设置 ' + name + '：' + (value ? '参会' : '放弃参会'),
          duration: 5000
        })
      } catch(e) {
        this.notifyError(e, '更新失败')
      } finally {
        this.busy = false
      }
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
</style>
