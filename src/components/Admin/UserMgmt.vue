<template>

  <div class="user-mgmt">
    <h3>
      用户管理
      <RefreshButton @click="fetch()" :loading="busy" throttle />
      <el-button
        style="padding: 6px 10px"
        type="primary"
        icon="el-icon-plus"
        round
        size="mini"
        @click="createNewUser"
      > 新建用户 </el-button>
    </h3>

    <div class="layout">
      <el-table class="table" :data="users" v-loading="!users">

        <el-table-column label="用户 / 邮箱" prop="id" sortable min-width="180" />

        <el-table-column label="权限"
          prop="access"
          sortable
          min-width="180"
        />

        <el-table-column label="学校 / 会场"
          prop="accessDesc"
          sortable
          min-width="180"
        >
          <template slot-scope="{row}">
            <template v-if="row.school">
              <div class="icon-text">
                <icon class="icon" name="university" />
                <span class="text">{{ row.school.name }}</span>
              </div>
            </template>
            <template v-if="row.session">
              <div class="icon-text">
                <icon class="icon" name="user-secret" />
                <span class="text">{{ row.session.name }}</span>
              </div>
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="120">
          <el-button-group slot-scope="{row}">
            <el-button
              type="warning"
              class="no-padding"
              size="small"
              :disabled="row.reserved || busy"
              icon="el-icon-edit"
              @click="resetPassword(row)"
            />
            <el-button
              type="danger"
              class="no-padding"
              size="small"
              :disabled="row.reserved || busy"
              icon="el-icon-delete"
              @click="deleteUser(row)"
            />
          </el-button-group>
        </el-table-column>
      </el-table>
    </div>

    <PasswordDialog ref="password" />

    <UserDialog ref="user" />
  </div>

</template>

<script>
import PasswordDialog from './components/PasswordDialog'
import UserDialog from './components/UserDialog'
import 'vue-awesome/icons/university'
import 'vue-awesome/icons/user-secret'

const toAccessString = (access) => {
  let ret = []
  if ( ! (access instanceof Array) )
    return ''
  for (let a of access) {
    switch (a) {
      case 'root':     ret.push('上帝'); break
      case 'admin':    ret.push('管理员'); break
      case 'finance':  ret.push('财务'); break
      case 'staff':    ret.push('一般组委'); break
      case 'leader':   ret.push('领队'); break
      case 'dais':     ret.push('会场主席'); break
      case 'delegate': ret.push('参会代表'); break
      case 'academic-director': ret.push('学术总监'); break
      case 'academic-staff': ret.push('学术团队'); break
    }
  }
  return ret.join('、')
}

// used to sort by access + access args
const toAccessDesc = (user) => {
  if (user.school) {
    return '3-' + user.school.name
  }
  if (user.session) {
    return '4-' + user.session.name
  }
  return '1-' + user.id
}

export default {
  name: 'user-mgmt',
  components: {
    PasswordDialog,
    UserDialog
  },
  data: () => ({
    users: null,
    busy: false
  }),
  methods: {
    async fetch() {
      this.busy = true
      try {
        const users = await this.$agent.get('/api/users/').body()
        this.users = users.map( $ => ({
          ... $,
          access: toAccessString( $.access ),
          accessDesc: toAccessDesc( $ )
        }) )
      } catch (e) {
        console.error(e)
        this.users = null
      } finally {
        this.busy = false
      }
    },
    async resetPassword(user) {
      let result = await this.$refs.password.open(user)
      if (result) {
        this.busy = true
        const { user, password } = result
        try {
          await this.$agent.patch('/api/users/'+user).send({ password })
          this.$notify({
            type: 'success',
            title: '已重置密码',
            duration: 5000
          })
        } catch(e) {
          this.$notify({
            type: 'warning',
            title: '未能重置密码',
            message: e.message,
            duration: 0
          })
        } finally {
          this.busy = false
        }
      }
    },
    async deleteUser(user) {
      this.$confirm(`确定删除 ${user.id}，此操作无法恢复`, '确认', { type: 'error', confirmButtonClass: 'el-button--danger' })
      .then(
        async confirm => {
          await this.$agent.delete(`/api/users/${user.id}`)
          this.fetch()
          this.$message({
            type: 'success',
            message: `已删除 ${user.id}`
          })
        },
        cancel => { }
      )
    },
    async createNewUser() {
      const result = await this.$refs.user.open()
      if (result) {
        try {
          const {
            status,
            body
          } = await this.$agent.post('/api/users/')
              .ok(({status}) => status === 200 || status === 410)
              .send({
                email: result.email,
                password: result.password,
                access: result.access,
                school: result.school,
                session: result.session
              })
          if (status === 200) {
            this.$message({
              type: 'success',
              message: '已创建用户：' + result.email
            })
          }
          if (status === 410) {
            this.$message({
              type: 'error',
              message: '用户已存在：' + result.email
            })
          }
          await this.fetch()
          if (status === 200 && this.users) {
            const newlyInsertedIndex = this.users.findIndex(user => user.id === body.id)
            this.users = [
              this.users[newlyInsertedIndex],
              ...this.users.slice(0, newlyInsertedIndex),
              ...this.users.slice(newlyInsertedIndex + 1)
            ]
          }
        } catch(e) {
          this.$message({
            type: 'error',
            message: e.message
          })
        }
      }
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex";
.user-mgmt
  flex-vert: flex-start center
  padding-bottom: 3em
  *
    flex-shrink: 0
  .layout
    align-self: stretch
    margin-top: 1em
    margin-bottom: 1em
    padding-left: 8ch
    padding-right: 8ch
    .table
      margin: 0 auto
      width: 100%
      max-width: 720px
      .icon
        color: #99a9bf
.icon-text
  flex-horz: flex-start center
  .icon
    margin-right: .25ch
    transform: scale(.8, .8)
.el-button.no-padding
  padding-left: 7px
  padding-right: 7px
</style>
