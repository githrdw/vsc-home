import { WIDGET_META } from './constants'

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