const def = [
    '0.apply',          '申请',
    '1.relinquishment', '一轮名额确认',
    '1.exchange',       '一轮名额交换',
    '1.reservation',    '一轮酒店预订',
    '1.payment',        '一轮付款',
    '1.paid',           '一轮付款审核',
    '1.complete',       '一轮完成',
    '2.reservation',    '追加酒店预订',
    '2.payment',        '追加付款',
    '2.paid',           '追加付款审核',
    '2.complete',       '追加完成',
    '3.confirm',        '信息确认',
    '9.complete',       '完成'
]

let mapping = null
let stages = null

function getName(s) {
    if (!mapping) {
        mapping = {}
        for (let i=0; i<def.length; i+=2)
            mapping[def[i]] = def[i+1]
    }
    return mapping[s]
}

function getStages() {
    if (!stages)
        stages = def.filter( (_, i) => i % 2 === 0 )
    return stages
}

export { getName, getStages }
