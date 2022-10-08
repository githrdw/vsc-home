const ComponentOnDrag = ({ dataTransfer, target }, meta) => {
  const { items } = dataTransfer || {}
  const id = target.getAttribute("data-id")

  if (id.includes(':') && meta[id]) {
    items?.add(JSON.stringify(meta[id]), "vsch/widget?w=2&h=2")
  }
}

export {
  ComponentOnDrag
}