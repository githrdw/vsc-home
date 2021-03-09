import BXClickableTile from 'carbon-web-components/es/components/tile/clickable-tile.js';

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
const randomGen = (list: string[]) => {
  return list[Math.round(Math.random() * (list.length - 1))]
}

export default class extends BXClickableTile {
  constructor() {
    super()
    console.warn(this)
    this.addEventListener('dragstart', e => {
      const { items } = e.dataTransfer || {}
      const object = {
        "id": "1",
        "type": "recent",
        "layout": {
          "lg": {
            "w": 3,
            "h": 9,
            "minW": 2,
            "minH": 2
          },
          "md": {
            "w": 3,
            "h": 9,
            "minW": 2,
            "minH": 2
          },
          "sm": {
            "w": 3,
            "h": 9,
            "minW": 2,
            "minH": 2
          }
        },
        "appearance": {
          "title": randomGen(titles),
          "icon": "star",
          "color": randomGen(colors),
        },
        "data": {}
      }
      items?.add(JSON.stringify(object), "vsch/widget?w=2&h=2")
      console.warn("SETTING Data", e)
    })
  }
}