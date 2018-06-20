const isPlainObject = o => o !== null && o !== undefined && Object.getPrototypeOf(o) === Object.prototype
const get = (o, attr, def) => attr.split('.').reduce((ret, key) => isPlainObject(ret) ? ret[key] : ret, o) || def
const set = (o, attr, val) => {
  const pos = attr.indexOf('.')
  const key = pos === -1 ? attr : attr.substring(0, pos)
  return {
    ...(o || {}),
    [key]: pos === -1
      ? val
      : set(
        get(o, key, {}),
        attr.substring(key.length + 1),
        val
      )
  }
}

export { isPlainObject, get, set }