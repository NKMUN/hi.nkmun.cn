function clampTo(val, min, max) {
  if (val < min) return min
  if (val > max) return max
  return val
}

function popoverAt(ref, el, spacing = 12) {
  setTimeout(_ => {
    const {
      height,
      width
    } = el.getBoundingClientRect()

    const {
      top,
      left,
      bottom,
      right
    } = ref.getBoundingClientRect()

    const {
      clientWidth,
      clientHeight
    } = document.documentElement

    const minLeft = 0
    const maxLeft = clientWidth - width / 2
    const minTop = 0
    const maxTop = clientHeight - height / 2

    const x = (left + right) / 2 - width / 2
    const yTop = top - height - spacing
    const yBottom = bottom + height + spacing
    const y = yTop > minTop ? yTop
            : yBottom < maxTop ? yBottom
            : (top + bottom) / 2

    const styles = {
      position: 'fixed',
      left: clampTo(x, minLeft, maxLeft)+ 'px',
      top: clampTo(y, minTop, maxTop) + 'px',
      transform: 'initial',
      transition: 'opacity .3s'
    }

    for (let key in styles)
      el.style[key] = styles[key]
  }, 0)
}

export { popoverAt as default }