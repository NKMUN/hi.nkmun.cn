function between(s, l, u) {
    let S = new Date(s).getTime()
    let L = new Date(l).getTime()
    let U = new Date(u).getTime()
    return L<=S && S<=U
}

function toDateTimeString(d) {
    const pad2 = val => {
        const ret = String(val)
        return ret.length < 2 ? '0' + ret : ret
    }
    const date = new Date(d)
    const yyyy = date.getFullYear()
    const month = date.getMonth() + 1    // js month starts from 0
    const monthDate = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return `${yyyy}-${pad2(month)}-${pad2(monthDate)} ${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
}

function toDateString(d) {
    const ret = toDateTimeString(d)
    return ret.slice(0, ret.indexOf(' '))
}

function parseDate(str) {
    const yyyy = parseInt(str.slice(0, 4), 10)
    const mm = parseInt(str.slice(5, 7), 10)
    const dd = parseInt(str.slice(8, 10), 10)
    return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0)
}

export { between, toDateTimeString, toDateString, parseDate }
