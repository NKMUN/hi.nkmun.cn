<script>
import UnifiedRegistration from '@/components/UnifiedRegistration'
import { Message } from 'element-ui'
import Banner from '@/components/Banner'
import Copyright from '@/components/Copyright'

export default {
  functional: true,
  render(h, ctx) {
    const router = ctx.parent.$router
    const store = ctx.parent.$store
    const applyAcademicStaff = store.getters['config/applyAcademicStaff']

    return applyAcademicStaff
    ? (
      <div class="academic-staff-register">
        <Banner />
        <div class="layout">
          <h4> 学术团队申请 </h4>,
          <p class="hint"> 创建帐号 </p>,
          <UnifiedRegistration
            access={['transient.academic-staff.apply']}
            onSuccess={({token}) => {
              store.commit('user/token', token)
              Message({
                type: 'success',
                message: '注册成功，请继续填写信息'
              })
              router.replace('/academic-staff/apply/basic')
            }}
          />
        </div>
        <Copyright />
      </div>
    )
    : (
      <div class="academic-staff-register">
        <Banner />
        <div class="layout">
          <h4> 现在不是学术团队申请时间 </h4>,
        </div>
        <Copyright />
      </div>
    )
  }
}
</script>

<style lang="stylus" scoped>
h4
  text-align: center
.academic-staff-register
  display: flex
  flex-direction: column
  justify-content: center
  align-items: stretch
  min-height: 100vh
.layout
  flex-grow: 1
  flex-shrink: 0
  padding-bottom: 3em
.hint
  text-align: center
  font-size: 90%
  color: #8492A6
</style>
