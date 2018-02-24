<template>
  <div class="academic-staff-application" v-loading="!fetched">
    <h4>学术团队申请</h4>

    <el-form :model="form" label-width="12ch" label-position="right">

      <el-form-item label="过往会期" prop="past_conferences">
        <el-input v-model="form.past_conferences" placeholder="用空格分隔不同会期，如：2016 2017 2018" />
      </el-form-item>

      <el-form-item label="职位列表">
        <el-table :data="form.departments || []">
          <el-table-column label="ID" prop="id" width="160px">
            <el-input slot-scope="{row}" v-model="row.id" @change="syncDepartments" size="mini" placeholder="字符、数字，需唯一" :minlength="1" :maxlength="8" :disabled="busy" />
          </el-table-column>
          <el-table-column label="名称" prop="name" min-width="30ch">
            <el-input slot-scope="{row}" v-model="row.name" @change="syncDepartments" size="mini" placeholder="请输入名称" :disabled="busy" />
          </el-table-column>
          <el-table-column label="操作" prop="name" width="48px" class-name="no-left-padding">
            <el-button slot-scope="{row}" type="danger" size="mini" class="no-padding" icon="el-icon-delete" @click="deleteDepartment(row)" :disabled="busy" />
          </el-table-column>
          <el-table-column label="题目" min-width="30ch">
            <div slot-scope="{row}">{{
              form.tests
                .filter(test => test.departments.includes(row.id))
                .map((test, idx) => `${idx + 1}`)
                .join(', ')
              || '无'
            }}</div>
          </el-table-column>
          <div slot="append" style="text-align: center">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addDepartment" plain :disabled="busy"> 新增 </el-button>
          </div>
        </el-table>
      </el-form-item>

      <el-form-item label="学术测试">
        <ListInput
          v-if="form.tests.length"
          v-model="form.tests"
          :item-model="() => ({ tag: '', text: '', departments: [], word_count_mode: 'no', minlength: 0, maxlength: 0 })"
          empty-text="暂无测试"
          class="tests"
          :disabled="busy"
        >
          <table slot-scope="{ item: test, handleInput, handleChange }">
            <tbody>
              <tr>
                <td class="field-name">标签</td>
                <td>
                  <el-input v-model="test.tag" size="mini" placeholder="通用/中文/英文" style="max-width: 30ch" :disabled="busy" />
                </td>
              </tr>
              <tr>
                <td class="field-name">职务</td>
                <td>
                  <el-select v-model="test.departments" size="mini" placeholder="请选择需作答职务" style="min-width: 40ch" multiple :disabled="busy">
                    <el-option
                      v-for="({id, name}, idx) in form.departments"
                      :key="id || idx"
                      :label="id && name ? name : '[请先完成职务列表]'"
                      :value="id"
                      :disabled="!id || !name"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <td class="field-name top">内容</td>
                <td>
                  <el-input v-model="test.text" size="mini" type="textarea" placeholder="题目内容" :disabled="busy" />
                </td>
              </tr>
            </tbody>
          </table>
        </ListInput>
      </el-form-item>

    </el-form>

    <el-button class="update" type="primary" icon="el-icon-check" @click="update" :loading="busy">保存</el-button>
  </div>
</template>

<script>
import ListInput from '@/components/form/ListInput'
export default {
  components: {
    ListInput
  },
  data() {
    return {
      fetched: false,
      busy: false,
      form: {
        past_conferences: '',
        departments: [],
        tests: []
      }
    }
  },
  methods: {
    deleteDepartment(row) {
      const idx = this.form.departments.indexOf(row)
      this.form.departments = [
        ...this.form.departments.slice(0, idx),
        ...this.form.departments.slice(idx + 1)
      ]
      this.syncDepartments()
    },
    addDepartment() {
      this.form.departments = [
        ...this.form.departments,
        { id: '', name: '' }
      ]
    },
    syncDepartments() {
      const allowedDepartments = new Set(this.form.departments.map(department => department.id))
      // remove deleted department
      this.form.tests = this.form.tests.map(test => ({
        ...test,
        departments: test.departments.filter(departmentId => allowedDepartments.has(departmentId))
      }))
    },
    fetch() {
      this.fetched = false
      return this.$agent.get(`/api/config/academic-staff-application`)
        .then(
          res => this.setValue(res.body),
          error => this.setValue(null)
        )
        .then(_ => this.fetched = true)
    },
    update() {
      this.busy = true
      const payload = {
        past_conferences: this.form.past_conferences.split(/\s+/g),
        departments: this.form.departments,
        tests: this.form.tests
      }
      return this.$agent.put(`/api/config/academic-staff-application`)
        .send(payload)
        .then(
          res => {
            this.setValue(res.body)
            this.$message({
              type: 'success',
              message: '已保存'
            })
          },
          error => this.$message({
            type: 'error',
            message: error.message
          })
        )
        .then(_ => this.busy = false)
    },
    setValue(val) {
      this.form.past_conferences = val && val.past_conferences && val.past_conferences.join(' ') || ''
      this.form.departments = val && val.departments || []
      this.form.tests = val && val.tests || []
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
h4
  text-align: center
.el-form
  max-width: 100ch
  margin: 0 auto
.tests
  width: 100%
.test
  label
    span
      margin-right: 2ch
  > td
    padding-bottom: .5em
    border-bottom: 1px solid #ebeef5
  .field-name
    width: 5ch
    text-align: center
    padding-right: 2ch
    color: #909399
    &.top
      vertical-align: top
.el-button.update
  display: block
  margin: 0 auto
.academic-staff-application
  padding-bottom: 3em
</style>

<style lang="stylus">
.el-table
  .no-padding .cell
    text-align: center
    padding-left: 0
    padding-right: 0
  .no-left-padding .cell
    text-align: center
    padding-left: 0
</style>
