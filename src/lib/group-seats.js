export default function groupBySession(seats) {
  return seats.reduce( (ret, val) => {
    // NOTE: ignore O(n) lookup complexity for small inputs
    let el = ret.find( g => g.session === val.session )
    if ( !el ) {
      ret.push({ session: val.session, list: [] })
      el = ret[ ret.length - 1 ]
    }
    el.list.push( val )
    return ret
  }, [])
}
