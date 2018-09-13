<script>
import ImageLoader from '@/components/Admin/components/ImageLoader'
import genderText from '@/lib/gender-text'
import SimpleField from '@/components/SimpleField'
import 'vue-awesome/icons/file-text-o'

export default {
  props: {
    value: {},
    tests: {}
  },
  render() {
    const { value, tests } = this
    if (!value || !tests)
      return (<div></div>)

    function buildParagraphs(str) {
      return str.trim().split(/[\n\r]+/g).map(paragraph => <p>{ paragraph }</p>)
    }

    return (
      <div class="academic-staff-application-form-view">

        <h5 class="center secondary">基本信息</h5>
        <div class="basic flex-horz" style="justify-content: center">
          <ImageLoader
            style="flex: 1 0 auto"
            src={`/api/images/${value.photoId}`}
            width="320px"
            height="240px"
            defaultWidth="320px"
            defaultHeight="240px"
          />
          <div style="flex: 1 0 auto">
            <SimpleField name="姓名" value={value.name} />
            <SimpleField name="性别" value={genderText(value.gender)} />
            <SimpleField name="学校" value={value.school} />
            <SimpleField name="年级">
              <span class="value">{value.grade}</span>
              <span class="delimiter" />
              <span class="value">{value.major}</span>
              { value.post_graduation && <span class="delimiter" /> }
              { value.post_graduation && <span class="value">{value.post_graduation}</span> }
            </SimpleField>
            <SimpleField name='生日' value={value.birthday} />
            <SimpleField name="手机" value={value.phone} />
            <SimpleField name="QQ" value={value.qq} />
            { value.skype && <SimpleField name="Skype" value={value.skype} /> }
            { value.note && <SimpleField name="备注" value={value.note} /> }
            <SimpleField name="提交日期" value={ value.signature_date } />
          </div>
        </div>

        <hr/>

        <h5 class="center secondary">申请</h5>
        <div class="roles">
          <SimpleField name="职位">
            { value.roles.map(role =>
                <div class="role">
                  <span class="department">{ role.department_name }</span>
                  <span class="position">{ role.position }</span>
                </div>
              )
            }
            { value.adjustment_language && <div class="secondary value center adjustment">工作语言接受调剂</div> }
            { value.adjustment_role && <div class="secondary value center adjustment">工作角色接受调剂</div> }
            { !value.adjustment_language && !value.adjustment_role && <div class="secondary value center">不接受调剂</div> }
          </SimpleField>

          { value.past_conference && value.past_conference.length > 0 &&
            <SimpleField name="往期会议" value={ value.past_conference.join(', ') } />
          }
          { value.past_roles && value.past_roles.length > 0 &&
            <SimpleField name="往期身份" value={ value.past_roles.join('、') } />
          }
          { !(value.past_conference && value.past_conference.length > 0)
            && !(value.past_roles && value.past_roles.length > 0)
            && <div class="secondary value center">未曾参加过汇文模联</div>
          }
          { value.past_note && <SimpleField name="备注" value={ value.past_note } /> }
        </div>

        <hr />

        <h5 class="center secondary">过往经历</h5>
        <div class="experiences">
          { value.experiences_as_delegate && value.experiences_as_delegate.length > 0 &&
            value.experiences_as_delegate.map(exp =>
              <SimpleField name="代表经历" class="experience">
                <SimpleField name="会议" value={exp.conference} />
                <SimpleField name="级别" value={exp.level} />
                <SimpleField name="主办方" value={exp.organizer} />
                <SimpleField name="委员会" value={exp.committee} />
                <SimpleField name="议题" value={exp.topic} />
                { exp.prize && <SimpleField name="奖项" value={exp.prize} /> }
              </SimpleField>
            )
          }

          { value.experiences_as_dais && value.experiences_as_dais.length > 0 &&
            value.experiences_as_dais.map(exp =>
              <SimpleField name="主席经历" class="experience">
                <SimpleField name="会议" value={exp.conference} />
                <SimpleField name="级别" value={exp.level} />
                <SimpleField name="主办方" value={exp.organizer} />
                <SimpleField name="委员会" value={exp.committee} />
                <SimpleField name="议题" value={exp.topic} />
                <SimpleField name="职位" value={exp.position} />
              </SimpleField>
            )
          }

          { value.experiences_as_organizer && value.experiences_as_organizer.length > 0 &&
            value.experiences_as_organizer.map(exp =>
              <SimpleField name="组织者经历" class="experience">
                <SimpleField name="会议" value={exp.conference} />
                <SimpleField name="级别" value={exp.level} />
                <SimpleField name="主办方" value={exp.organizer} />
                <SimpleField name="职位" value={exp.position} />
                <SimpleField name="职务" value={exp.topic} />
              </SimpleField>
            )
          }

          { value.experiences_of_other_events && value.experiences_of_other_events.length > 0 &&
            value.experiences_of_other_events.map(exp =>
              <SimpleField name="组织者经历" class="experience">
                <SimpleField name="活动名称" value={exp.conference} />
                <SimpleField name="职位" value={exp.position} />
                <SimpleField name="职务" value={exp.topic} />
              </SimpleField>
            )
          }
        </div>

        <hr />

        <h5>学术测试</h5>
        <div class="tests">
          {
            tests
            .map((test, idx) => ({...test, id: `q${idx}`}))
            .filter(test =>
              // filter questions that are required to answer accodring to roles
              test.departments.find(departmentId =>
                value.roles.find(role => role.department_id === departmentId)
              )
            )
            .map(test =>
              <div class="test">
                <div class="tag">{ test.tag }</div>
                <div class="right">
                  <div class="question">{ buildParagraphs(test.text) }</div>
                  <div class="answer">
                    { value.test[test.id]
                      ? <div class="answers value">{ buildParagraphs(value.test[test.id]) }</div>
                      : <div class="answers secondary value"> 未作答 </div>
                    }
                  </div>
                </div>
              </div>
            )
          }
        </div>

        <div class="files">
          { value.academic_design && value.academic_design.length > 0
            ? <SimpleField name="会场设计">
                { value.academic_design.map(file =>
                    <a href={'/api' + file.signedUrl} target="_blank" class="file flex-horz">
                      <icon name="file-text-o" /> <span class="filename">{ file.name }</span>
                    </a>
                  )
                }
              </SimpleField>
            : <div class="center secondary">未上传会场设计</div>
          }
          { value.previous_work && value.previous_work.length > 0
            ? <SimpleField name="过往作品">
                { value.previous_work.map(file =>
                    <a href={'/api' + file.signedUrl} target="_blank" class="file flex-horz">
                      <icon name="file-text-o" /> <span class="filename">{ file.name }</span>
                    </a>
                  )
                }
              </SimpleField>
            : <div class="center secondary">未上传过往作品</div>
          }
        </div>

        { value.additional_comment && <hr/> }
        { value.additional_comment && <h5>其它</h5> }
        { value.additional_comment &&
          <div class="etc">
            <SimpleField name="补充说明">
              { buildParagraphs(value.additional_comment) }
            </SimpleField>
          </div>
        }
      </div>
    )
  }
}
</script>

<style lang="stylus">
.academic-staff-application-form-view
  display: flex
  flex-direction: column
  align-items: center
  justify-content: flex-start
  > *
    flex-shrink: 0
  .flex-horz
    display: flex
    flex-direction: row
    align-items: flex-start
    justify-content: flex-start
  .image-loader-wrapper
    justify-content: flex-start
    margin: 3rem 4ch 1em 4ch
  .simple-field
    align-items: center
    margin: .75em 0
    display: flex
    flex-direction: row
    align-items: center
    justify-content: flex-start
  .center
    text-align: center
  hr
    align-self: stretch
  .name
    text-align: right
    margin-right: 2ch
    font-size: 80%
    color: #909399
    flex: 0 0 auto
  .value
    flex: 1 0 auto
    &.secondary
      color: #606266
      font-size: 80%
  .delimiter:before
    content: "/"
    font-size: 80%
    margin: 0 1ch
    color: #c0c4cc
  .basic
    .name
      min-width: 4ch
  .roles
    margin: 0 auto
    .name
      min-width: 8ch
    .role
      display: block
    .position
      display: inline-block
      transform-origin: center center
      transform: scale(0.8, 0.8)
      color: #606266
      &:before
        content: " - "
    .adjustment
      color: #909399
      margin: .5em 0
  .experiences
    > .simple-field
      border-bottom: 1px solid #EBEEF5
    > .simple-field:last-child
      border-bottom: 0
    .name
      min-width: 10ch
    .value
      max-width: 56ch
    .simple-field .simple-field
      margin: .25em 0
      .name
        min-width: 8ch
  .tests
    min-width: 60ch
    max-width: 80ch
    .test
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: flex-start
      border-bottom: 1px solid #ebeef5
      &:last-child
        border-bottom: 0
      & ~ .test
        margin-top: 1em
      > *
        flex-shrink: 0
      p ~ p
        margin: 1em 0
      p:last-child
        margin-bottom: 0
      .tag
        color: #606266
        width: 8ch
        margin: 1em 2ch 1em 0
      .right
        width: calc(100% - 10ch)
      .question
        color: #909399
        font-size: 80%
        p
          margin-left: 1.5ch
          margin-right: 2.5ch
      .answer
        padding: .75em 1.5ch
        border: 1px solid #e4e7ed
        border-radius: .5em
        margin: 1em 0
        flex-grow: 1
        min-height: 3em
        box-sizing: content-box
  .files
    .name
      width: 8ch
    .value
      max-width: 50ch
    .file
      color: #409eff
      align-items: center
      &:visited
        color: #409eff
      &:hover
        color: #66b1ff
      .filename
        margin-left: 1ch
  .etc
    .name
      width: 8ch
    .value
      width: 60ch
    p ~ p
      margin: 1em 0
    p:last-child
      margin-bottom: 0
</style>
