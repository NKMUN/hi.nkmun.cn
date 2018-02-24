const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
import tlds from 'tlds'

export default (rules, val, cbk) => {
    if (!val) return cbk([ new Error('请输入邮箱') ])

    // check is email format
    if (!emailRegex.test(val)) return cbk([ new Error('邮箱格式不正确') ])

    // check tld
    const dotPos = val.lastIndexOf('.')
    const tld = val.slice(dotPos + 1)
    if (!tlds.includes(tld)) cbk([ new Error('请检查邮箱地址和后缀是否正确') ])

    cbk([ ])
}
