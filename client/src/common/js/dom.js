export function getData(el, name, val) {
  name = 'data-' + name
  if (val) {
    return el.setAttribute(name, val)
  }
  return el.getAttribute(name)
}

const elementStyle = document.createElement('div').style
const vendor = (() => {
  const transformNames = {
    standard: 'transform',
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform'
  }
  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style[0].toUpperCase() + style.substr(1)
}
