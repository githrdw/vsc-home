import "./style.scss"
import "mustache"
import EventBus from 'core/src/utils/EventBusClient'
import { ComponentOnDrag } from './component'
import { BUILTIN_WIDGETS, WIDGET_META } from './constants'

const Client = new EventBus()

// Action button events
const buttons = document.querySelectorAll("button[data-action]")
for (button of buttons) {
  button.addEventListener("click", () => {
    const action = button.getAttribute("data-action")
    Client.emit(action)
  })
}

const loadCustomWidgets = async () => {
  const widgetsMeta = {}
  const template = document.getElementById('component-tmpl').innerText;
  const { widgets } = await Client.emit('vsch.core.getCustomWidgets') || []
  for (const widgetIndex in widgets) {
    const widget = widgets[widgetIndex]
    const id = `${widget.lib}:${widget.entry}`
    widgetsMeta[id] = {
      ...WIDGET_META,
      type: "custom",
      data: {
        widget
      }
    }
    widget['id'] = id
  }
  const rendered = Mustache.render(template, { components: [...widgets, ...BUILTIN_WIDGETS] });
  document.getElementById('components').innerHTML = rendered;

  // Drag events
  const components = document.querySelectorAll("article.component")
  const onDrag = (e) => ComponentOnDrag(e, widgetsMeta)
  for (component of components) {
    component.removeEventListener('dragstart', onDrag)
    component.addEventListener('dragstart', onDrag)
  }
}
// List and template render
loadCustomWidgets()