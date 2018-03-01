<template>
  <el-dialog title="新建用户" :visible.sync="visible" width="60ch" :close-on-click-modal="false">
    <el-form :model="formData" ref="form" label-width="10ch" label-position="right">
      <el-form-item label="用户名" required>
        <el-input v-model="email" placeholder="用户名" />
      </el-form-item>

      <el-form-item label="密码" required>
        <el-input v-model="password" placeholder="密码" />
      </el-form-item>

      <el-form-item label="权限" required >
        <el-select style="width: 100%" v-model="access" placeholder="权限" multiple>
          <el-option value="staff" label="组委 / Staff" />
          <el-option value="finance" label="财务 / Finance" />
          <el-option value="dais" label="会场主席 / Dais" />
          <el-option value="academic-director" label="学术总监 / Academic Director" />
          <el-option value="leader" label="学校领队 / Leader" />
          <!--
          <el-option value="individual" label="个人代表 / Individual" />
          <el-option value="delegate" label="参会代表 / Delegate" />
          -->
        </el-select>
      </el-form-item>

      <el-form-item v-if="access.includes('dais')" label="会场">
        <el-select v-model="session" placeholder="会场">
          <el-option v-for="s in sessions" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="access.includes('leader')" label="学校">
        <el-select v-model="school" placeholder="学校" filterable>
          <el-option v-for="s in schools" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  computed: {
    formData() {
      return {
        email: this.email,
        password: this.password,
        access: this.access,
        school: this.school,
        session: this.session
      }
    }
  },
  data() {
    return {
      email: null,
      password: null,
      access: [],
      school: null,
      session: null,
      schools: [],
      sessions: [],
      visible: false,
      resolve: null
    }
  },
  methods: {
    open() {
      this.fetchSchools()
      this.fetchSessions()
      this.email = null
      this.password = null
      this.access = []
      this.school = null
      this.session = null
      this.visible = true
      return new Promise(resolve => {
        this.resolve = (...args) => {
          resolve(...args)
          this.visible = false
          this.resolve = null
        }
      })
    },
    handleCancel() {
      this.resolve(null)
    },
    handleConfirm() {
      // build entries
      this.$refs.form.validate()
      .then(
        success => {
          let ret = {}
          ;['email', 'password', 'access', 'session', 'school']
              .filter(key => this[key])
              .forEach(key => ret[key] = this[key])
          this.resolve(ret)
        },
        failure => {
          // nop
        }
      )
    },
    fetchSchools() {
      this.$agent.get('/api/schools/').then(
        res => this.schools = res.body,
        _ => null
      )
    },
    fetchSessions() {
      this.$agent.get('/api/sessions/').then(
        res => this.sessions = res.body,
        _ => null
      )
    }
  }
}
</script>

<style lang="stylus">

</style>