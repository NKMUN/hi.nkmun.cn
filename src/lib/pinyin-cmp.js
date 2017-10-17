const pinyinCmp = (a, b) => String(a).localeCompare(String(b), 'zh-Hans-CN', {sensitivity: 'accent'})

export default pinyinCmp