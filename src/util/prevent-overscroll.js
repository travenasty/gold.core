export default function preventOverscroll (el) {
  el.addEventListener('touchstart', function () {
    let top = el.scrollTop
    let totalScroll = el.scrollHeight
    let currentScroll = top + el.offsetHeight

    if (top === 0) {
      el.scrollTop = 1
    } else if (currentScroll === totalScroll) {
      el.scrollTop = top - 1
    }
  })

  el.addEventListener('touchmove', function (evt) {
    if (el.offsetHeight < el.scrollHeight) {
      evt._isScroller = true
    }
  })
}

document.body.addEventListener('touchmove', function (evt) {
  if (!evt._isScroller) {
    evt.preventDefault()
  }
})
