<template>
  <div class="session-mgmt" v-loading.body="!sessions">
    <h3>会场管理</h3>

    <div class="note">
      <ul>
        <li>会场ID不能重复</li>
        <li>谨慎修改已创建会场的ID</li>
        <li><code>extra_leader</code>为非参会代表领队</li>
      </ul>
    </div>

    <el-table v-if="sessions" :data="sessions" class="session-table">
      <el-table-column prop="id" label="ID" width="144" sortable>
        <el-input
          slot-scope="{row, $index}"
          v-model="row.id"
          placeholder="cn_1"
          :minlength="1"
          :maxlength="16"
          :class="validation[$index] && !validation[$index].id ? 'error' : ''"
          :disabled="busy || row.reserved"
        />
      </el-table-column>

      <el-table-column prop="name" label="名称" min-width="172" sortable resizable>
        <el-input
          slot-scope="{row, $index}"
          v-model="row.name"
          placeholder="会场名称"
          :class="validation[$index] && !validation[$index].name ? 'error' : ''"
          :disabled="busy"
        />
      </el-table-column>

      <el-table-column prop="type" label="类型" width="144" sortable>
        <el-select
          slot-scope="{row, $index}"
          v-model="row.type"
          placeholder="请选择"
          :class="validation[$index] && !validation[$index].type ? 'error' : ''"
          :disabled="busy || row.reserved"
        >
          <el-option v-for="type in sessionTypes" :key="type" :label="type" :value="type" />
        </el-select>
      </el-table-column>

      <el-table-column prop="dual" label="双代" width="54">
        <el-checkbox
          slot-scope="{row, $index}"
          v-model="row.dual"
          :class="validation[$index] && !validation[$index].dual ? 'error' : ''"
          :disabled="busy || row.reserved"
        />
      </el-table-column>

      <el-table-column prop="requiresChairman" label="主席" width="54">
        <el-checkbox
          slot-scope="{row, $index}"
          v-model="row.requiresChairman"
          :class="validation[$index] && !validation[$index].requiresChairman ? 'error' : ''"
          :disabled="busy || row.reserved"
        />
      </el-table-column>

      <el-table-column prop="exchangeable" label="交换" width="54">
        <el-checkbox
          slot-scope="{row, $index}"
          v-model="row.exchangeable"
          :class="validation[$index] && !validation[$index].exchangeable ? 'error' : ''"
          :disabled="busy || row.reserved"
        />
      </el-table-column>

      <el-table-column prop="estimatedAttendance" label="预计人数" width="84">
        <el-input-number
          slot-scope="{row, $index}"
          v-model="row.estimatedAttendance"
          size="small"
          :controls="false"
          :disabled="busy"
          :min="0"
          style="display: table-cell;"
        />
      </el-table-column>

      <el-table-column prop="price" label="单价" width="84">
        <el-input-number
          slot-scope="{row, $index}"
          v-model="row.price"
          size="small"
          :controls="false"
          :class="validation[$index] && !validation[$index].price ? 'error' : ''"
          :disabled="busy"
          :min="0"
          style="display: table-cell;"
        />
      </el-table-column>

      <el-table-column label="操作" width="72">
        <el-button
          slot-scope="{row, $index}"
          type="text"
          size="small"
          icon="el-icon-delete"
          @click="deleteSession($index)"
          :disabled="busy || row.reserved"
        > 删除 </el-button>
      </el-table-column>
    </el-table>

    <div class="controls editor"  v-if="sessions">
      <el-button
        type="text"
        size="small"
        icon="el-icon-plus"
        @click="addSession"
        :disabled="busy"
      > 增加会场 </el-button>
    </div>

    <el-alert
      v-if="showValidationAlert && sessions"
      type="error"
      title="请修正用红色标出的项目"
      :closable="false"
    />

    <div class="controls commit center" v-if="sessions">
      <el-button
        type="warning"
        icon="el-icon-close"
        @click="abort"
        :busy="busy"
      > 放弃更改 </el-button>
      <el-button
        type="success"
        icon="el-icon-check"
        @click="confirm"
        :busy="busy"
      > 确认更改 </el-button>
    </div>

  </div>
</template>

<script>
import sessionTypes from '@/lib/session-types'

const keys = obj => {
    let ret = []
    for (let k in obj)
      ret.push(k)
    return ret
}

const DEFAULT_SESSION = () => ({
  id: null,
  name: null,
  type: null,
  dual: false,
  estimatedAttendance: 0,
  requiresChairman: false,
})

function objectsAreSame(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export default {
  name: 'session-mgmt',
  data: () => ({
    busy: false,
    sessions: null,
    serverSessions: null,
    sessionTypes,
    validation: null,
    showValidationAlert: false
  }),
  methods: {
    validate() {
      let result = this.sessions.map( obj => keys(obj).reduce( (r, k) => ({...r, [k]: true}), {} ) )
      let idxOf = {}
      let valid = true
      this.sessions.forEach( ({id, name, type, reserved}, idx) => {
        if ( idxOf[id] !== undefined ) {
          result[idx].id = false
          result[ idxOf[id] ].id = false
          valid = false
        }
        idxOf[id] = idx
        if ( ! ( id && /[a-zA-Z0-9_]{1,16}/.test(id) ) ) {
          result[idx].id = false
          valid = false
        }
        if ( ! name ) {
          result[idx].name = false
          valid = false
        }
        if ( !type && !reserved ) {
          result[idx].type = false
          valid = false
        }
      })
      this.validation = result
      return valid
    },
    deleteSession(idx) {
      this.sessions.splice( idx, 1 )
    },
    addSession() {
      this.sessions.push( DEFAULT_SESSION() )
    },
    async confirm() {
      this.showValidationAlert = false
      if ( ! this.validate() ) {
        this.showValidationAlert = true
        return false
      }
      this.busy = true
      try {
        const serverSessions = await this.$agent.put('/api/sessions/', this.sessions).body()
        this.serverSessions = serverSessions.map( $ => ({ ...DEFAULT_SESSION(), ...$ }) )
        this.sessions = serverSessions.map( $ => ({ ...DEFAULT_SESSION(), ...$ }) )
        this.$store.commit('config/update', { sessions: serverSessions.map( $ => ({ ...$ }) ) })
        this.$notify({
          type: 'success',
          title: '提交成功',
          message: '已成功提交会场设置',
          duration: 5000
        })
        return true
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '提交失败',
          message: e.message,
          duration: 0
        })
        return false
      } finally {
        this.busy = false
      }
    },
    abort() {
      // copy serverSessions
      this.sessions = this.serverSessions.map( $ => ({ ...DEFAULT_SESSION(), ...$ }) )
      this.validate()
      this.showValidationAlert = false
    }
  },
  async mounted() {
    try {
      const serverSessions = await this.$agent.get('/api/sessions/').body()
      // make sure a copy of array is passed to vue
      this.serverSessions = serverSessions.map( $ => ({ ...DEFAULT_SESSION(), ... $ }))
      this.sessions = serverSessions.map( $ => ({ ...DEFAULT_SESSION(), ...$ }))
      this.validate()
    } catch(e) {
      this.$notify({
        type: 'error',
        title: '获取会场列表失败',
        message: e.message,
        duration: 0
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if ( ! objectsAreSame(this.sessions, this.serverSessions) ) {
      // edited, prompt for confirmation
      next(false)
      this.$confirm('请提交或放弃更改', '操作确认', { type: "warning" })
    } else {
      next()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.session-mgmt
  flex-vert: flex-start center
  padding-bottom: 2em
  overflow: auto
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .session-table
    max-width: 120ch
  .controls.commit
    margin-top: 3em
  .el-alert
    width: auto
    margin: 1em auto
</style>
