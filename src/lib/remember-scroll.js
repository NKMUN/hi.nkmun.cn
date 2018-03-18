const set = (k ,v) => sessionStorage.setItem(k, v)
const get = (k) => sessionStorage.getItem(k)
const remove = (k) => sessionStorage.removeItem(k)

export function rememberScroll(el = document.scrollingElement, key = location.href) {
  set(key, JSON.stringify({
    x: el.scrollLeft,
    y: el.scrollTop
  }))
}

export function restoreScroll(el = document.scrollingElement, key = location.href) {
  const pos = JSON.parse(get(key))
  if (pos) {
    el.scrollLeft = pos.x
    el.scrollTop = pos.y
  }
}

export function clearScroll(key = location.href) {
  remove(key)
}
