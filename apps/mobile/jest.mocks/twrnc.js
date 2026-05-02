const handler = {
  get(_target, prop) {
    if (prop === 'style') return () => ({})
    if (prop === 'color') return () => ''
    return () => ({})
  },
  apply() {
    return {}
  },
}

const tw = new Proxy(() => ({}), handler)
tw.style = () => ({})
tw.color = () => ''

module.exports = { create: () => tw }
