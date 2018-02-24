<template>
  <div v-loading="!config">
    <h4> 申请职位 </h4>

    <el-form :model="form" label-position="right" label-width="8ch" ref="form">
      <el-form-item label="职位" prop="roles" :rules="[
        { validator: roleValidator, required: true }
      ]">
        <div class="hint">可复选，留空视为不选择</div>
        <table>
          <tbody>
            <tr class="department" v-for="department in config ? config.departments : []" :key="department.id">
              <td class="name">{{ department.name }}</td>
              <td class="roles">
                <MutuallyExclusiveCheckboxGroup
                  v-model="form.roles"
                  @change="emit"
                  :options="[
                    { label: '负责人', value: { department_id: department.id, department_name: department.name, position: '负责人' } },
                    { label: '成员', value: { department_id: department.id, department_name: department.name, position: '成员' } }
                  ]"
                  :option-cmp="(a, b) => a === b || (a.department_id === b.department_id && a.position === b.position)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>

      <el-form-item>
        <div class="adjustment"><el-checkbox v-model="form.adjustment_language" @change="emit" label="工作语言接受调剂" /></div>
        <div class="adjustment"><el-checkbox v-model="form.adjustment_role" @change="emit" label="职位申请接受调剂" /></div>
      </el-form-item>

      <el-form-item label="备注" prop="role_note">
        <el-input v-model="form.role_note" @change="emit" />
      </el-form-item>

      <h4>是否参加过汇文模联</h4>
      <div class="hint" style="text-align: center">若无，请留空</div>
      <el-form-item label="身份" prop="past_roles">
        <el-checkbox-group v-model="form.past_roles" @change="emit">
          <el-checkbox label="代表" />
          <el-checkbox label="主席" />
          <el-checkbox label="组委" />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="年份">
        <el-checkbox-group v-model="form.past_conferences" @change="emit" class="past-conferences">
          <el-checkbox v-for="conference in config ? config.past_conferences : []" :label="conference" :key="conference" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.past_note" @change="emit" />
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import MutuallyExclusiveCheckboxGroup from '../form/MutuallyExclusiveCheckboxGroup'
import CheckboxGroup from 'element-ui/lib/checkbox-group'
export default {
  components: {
    MutuallyExclusiveCheckboxGroup,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    value(val) {
      this.setValue(val)
    }
  },
  computed: {
    roleValidator() {
      return (rules, val, cbk) => {
        return val && val.length ? cbk([]) : cbk([new Error('至少要选择一个职位')])
      }
    }
  },
  data() {
    return {
      form: {
        roles: [],
        adjustment_language: null,
        adjustment_role: null,
        role_note: null,
        past_conferences: [],
        past_roles: [],
        past_note: null,
      },
      config: null,
      configResolve: null
    }
  },
  methods: {
    emit() {
      this.$emit('input', this.form)
    },
    fetchConfig() {
      this.configResolve = this.$agent.get(`/api/config/academic-staff-application`).body()
        .then(
          body => this.config = body,
          _ => null
        )
    },
    setValue(value) {
      this.form.roles = value && value.roles || []
      this.form.adjustment_language = value && value.adjustment_language || null
      this.form.adjustment_role = value && value.adjustment_role || null
      this.form.role_note = value && value.role_note || null
      this.form.past_conferences = value && value.past_conferences || []
      this.form.past_roles = value && value.past_roles || []
      this.form.past_note = value && value.past_note || null
    },
    validate() {
      return this.configResolve.then(_ =>
        this.$refs.form.validate().then(_ => true, _ => false)
      )
    }
  },
  created() {
    this.setValue(this.value)
    this.fetchConfig()
  }
}
</script>

<style lang="stylus" scoped>
h4
  text-align: center
.el-form
  max-width: 60ch
  margin: 0 auto
.department
  line-height: initial
  .name
    padding-right: 4ch
.adjustment
  line-height: initial
.hint
  font-size: 90%
  color: #99A9BF
  line-height: initial
.past-conferences
  .el-checkbox+.el-checkbox
    margin: 0
  .el-checkbox
    width: 12ch
</style>
