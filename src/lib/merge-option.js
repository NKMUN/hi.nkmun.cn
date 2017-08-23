export default (def, opt) => {
  let ret = { ...def }
  for (let key in opt)
    if (opt[key] !== undefined && opt[key] !== null)
      ret[key] = opt[key]
  return ret
}
