import "./style.scss"
import "mustache"
import EventBus from 'core/src/utils/EventBusClient'
import { ComponentOnDrag } from './component'

const Client = new EventBus()
const ComponentRender = {
  components: [
    {
      title: "Recent projects",
      subtitle: "List of recent opened folders and workspaces"
    },
    {
      title: "Collection",
      subtitle: "Editable list of recent folders and workspaces"
    },
    {
      title: "Notes",
      subtitle: "WYSIWYG editor for taking notes"
    },
  ]
}

// Action button events
const buttons = document.querySelectorAll("button[data-action]")
for (button of buttons) {
  button.addEventListener("click", () => {
    const action = button.getAttribute("data-action")
    Client.emit(action)
  })
}

// List and template render
const template = document.getElementById('component-tmpl').innerText;
const rendered = Mustache.render(template, ComponentRender);
document.getElementById('components').innerHTML = rendered;

// Drag events
const components = document.querySelectorAll("article.component")
for (component of components) {
  component.addEventListener('dragstart', ComponentOnDrag)
}