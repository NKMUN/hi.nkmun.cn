import format from 'dateformat'

function toDateString(d) {
    return format( new Date(d), 'yyyy-mm-dd', false, false )
}

function between(s, l, u) {
    let S = new Date( toDateString(s) ).getTime()
    let L = new Date(l).getTime()
    let U = new Date(u).getTime()
    return L<=S && S<=U
}

export { toDateString, between }
