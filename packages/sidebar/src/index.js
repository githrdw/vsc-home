import "./style.scss"
import "mustache"
import EventBus from 'core/src/utils/EventBusClient'
import { ComponentOnDrag } from './component'
import { BUILTIN_WIDGETS, WIDGET_META } from './constants'

const Client = new EventBus()

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

const actionDashboard = document.getElementById("action-dashboard")
const openDashboard = () => Client.emit('vsch.ui.open')
const enableEditmode = () => Client.emit('vsch.ui.enableEditmode')
const disableEditmode = () => Client.emit('vsch.ui.disableEditmode')
const initialActionDashboard = () => {
  actionDashboard.innerText = "Open dashboard"
  actionDashboard.onclick = openDashboard
}

Client.on('ui.editmodeState', ({ payload: { active } }) => {
  if (active) {
    actionDashboard.innerText = "Stop editing dashboard"
    actionDashboard.onclick = disableEditmode
  } else {
    actionDashboard.innerText = "Edit dashboard"
    actionDashboard.onclick = enableEditmode
  }
})

Client.on('ui.isActive', ({ payload: { active } }) => {
  if (active) {
    Client.emit('vsch.ui.getEditmodeState')
  } else {
    initialActionDashboard()
  }
})

initialActionDashboard()
loadCustomWidgets()

Client.emit('vsch.ui.getEditmodeState')