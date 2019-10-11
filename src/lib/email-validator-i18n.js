const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
import tlds from 'tlds'

export default (rules, val, cbk) => {
    if (!val) return cbk([ new Error('Please provide email address') ])

    // check is email format
    if (!emailRegex.test(val)) return cbk([ new Error('Email address format is incorrect') ])

    // check tld
    const dotPos = val.lastIndexOf('.')
    const tld = val.slice(dotPos + 1)
    if (!tlds.includes(tld)) cbk([ new Error('Email provider is unacceptable') ])

    cbk([ ])
}
