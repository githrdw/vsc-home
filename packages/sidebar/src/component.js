import { BUILTIN_WIDGETS, WIDGET_META } from './constants'

const titles = [
  "Just keep swimming",
  "Why so serious?",
  "Bond. James Bond.",
  "Houston, we have a problem.",
  "A martini. Shaken, not stirred.",
]
const colors = [
  'red.2',
  'green.2',
  'blue.2',
  'white.2',
  'black.2',
]
const randomGen = (list) => {
  return list[Math.round(Math.random() * (list.length - 1))]
}

const ComponentOnDrag = ({ dataTransfer, target }, meta) => {
  const { items } = dataTransfer || {}
  const id = target.getAttribute("data-id")

  if (id.includes(':')) {
    if (meta[id]) {
      console.warn(meta[id])
      items?.add(JSON.stringify(meta[id]), "vsch/widget?w=2&h=2")
    }
  }
  else {
    items?.add(JSON.stringify({
      ...WIDGET_META,
      type: id,
    }), "vsch/widget?w=2&h=2")

  }
}

export {
  ComponentOnDrag
}