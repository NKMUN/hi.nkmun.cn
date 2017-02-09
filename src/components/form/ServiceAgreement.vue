<template>
  <div>

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <div class="service-agreement" v-if="serviceAgreement">

      <p>请阅读并确认以下服务协议：</p>

      <div v-html="serviceAgreement" />

      <el-form
        :class="className"
        :model="M"
        ref="form"
      >
        <el-form-item
          prop="checked"
          :rules="validator"
        >
          <el-checkbox v-model="checked"> <b>我理解并同意以上服务协议</b> </el-checkbox>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>

<script>
import { Form, FormItem, Checkbox } from 'element-ui'
import Precondition from 'components/Precondition'

export default {
  name: 'service-agreement',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Checkbox.name]: Checkbox,
    Precondition
  },
  props: {
    disabled: { type: Boolean, default: false },
    className: { type: String, default: '' },
    model: { type: Boolean, default: false }
  },
  data: () => ({
    serviceAgreement: null,
    checked: false,
    validator: {
      validator(r, v, cb) {
        return
        if ( v!== true )
          cb([ new Error('你必须同意许可协议才能继续') ])
        else
          cb([])
      }
    }
  }),
  computed: {
    M() { return { checked: this.checked } }
  },
  methods: {
    configLoader() {
      return this.$agent.get('/api/service-agreement').then( res => res.body )
    },
    configParser(config) {
      this.serviceAgreement = config.html
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.emit()
    }
  },
  watch: {
    checked(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    model(value) {
      this.checked = value || false
    }
  }
}
</script>
