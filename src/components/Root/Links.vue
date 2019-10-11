<template>
  <el-table :data="builtLinks" class="table">
    <el-table-column label="功能" prop="title" width="120" />
    <el-table-column class-name="monospace" label="地址" prop="href" min-width="360" />
  </el-table>
</template>

<script>
export default {
  computed: {
    builtLinks() {
      return this.links.map(([title, path]) => ({
        title,
        href: location.origin + '/#' + path
      }))
    },
    links() {
      return [
        ['学术团队注册', '/dais-registration/'],
        ['志愿者注册',   '/volunteer/'],
        ['组委注册',     '/committee/'],
        ['国际报名',     '/apply/foreigner/?ref=<渠道标识>']
      ]
    }
  },
}
</script>

<style lang="stylus" scoped>
.table
  max-width: 720px
  margin: 2em auto
</style>

<style lang="stylus">
.el-table
  .monospace .cell
    font-family: monospace
</style>
