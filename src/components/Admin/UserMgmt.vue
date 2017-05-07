<template>

  <div class="user-mgmt">
    <h3>用户管理</h3>
    <el-button
      type="primary"
      :loading="busy"
      icon="information"
      @click="fetch()"
    > 刷新 </el-button>

    <div class="layout">
      <el-table class="table" :data="users" v-loading="!users">
        <el-table-column label="用户名" prop="id" sortable min-width="180" />
        <el-table-column label="权限" prop="access" min-width="120" />
        <el-table-column label="学校" prop="school.name" sortable min-width="180" />
        <el-table-column label="操作" min-width="90">
          <template scope="scope">
            <el-button
              type="warning"
              size="small"
              :disabled="scope.row.reserved || busy"
              @click="resetPassword(scope.row)"
            > 重置密码 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <PasswordDialog
      ref="password"
    />
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { getName } from '../../STAGE_DEF'
import PasswordDialog from './components/PasswordDialog'

const toAccessString = (access) => {
  let ret = []
  if ( ! (access instanceof Array) )
    return ''
  for (let a of access) {
    switch (a) {
      case 'school': ret.push('领队'); break
      case 'admin':  ret.push('组委'); break
      case 'root':   ret.push('管理员'); break
    }
  }
  return ret.join(' ')
}

export default {
  name: 'user-mgmt',
  components: {
    PasswordDialog
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
  },
  data: () => ({
    users: null,
    busy: false
  }),
  methods: {
    async fetch() {
      this.users = null
      try {
        let {
          body
        } = await this.$agent.get('/api/users/')
                  .set( ... this.authorization )
        this.users = body.map( $ => ({
          ... $,
          access: toAccessString( $.access )
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
          let {
            ok
          } = await this.$agent.patch('/api/users/'+user)
                    .set( ... this.authorization )
                    .send({ password })
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
</style>
