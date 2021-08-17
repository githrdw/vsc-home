import "./style.scss";
import Mustache from "mustache";
import EventBus from "vsch-core/src/utils/EventBusClient";
import { ComponentOnDrag } from "./component";
import { BUILTIN_WIDGETS, WIDGET_META } from "./constants";

const Client = new EventBus();

const getLayout = (uid) =>
  document.getElementById("layouts").querySelector(`[data-uid="${uid}"]`);
const getDefaultState = (el) => {
  const uid = el.getAttribute("data-uid");
  const name = el.getAttribute("data-name");

  return () => {
    el.innerText = name;
    el.onclick = () => {
      Client.emit("vsch.ui.open", { uid });
    };
  };
};

const loadCustomWidgets = async () => {
  const widgetsMeta = {};
  const template = document.getElementById("widget-tmpl").innerText;
  const { widgets } = (await Client.emit("vsch.core.getCustomWidgets")) || [];
  for (const widgetIndex in widgets) {
    const widget = widgets[widgetIndex];
    const id = `${widget.lib}:${widget.entry}`;
    widgetsMeta[id] = {
      ...WIDGET_META,
      type: "custom",
      data: {
        widget,
      },
    };
    widget["id"] = id;
  }
  const rendered = Mustache.render(template, {
    widgets: [...widgets, ...BUILTIN_WIDGETS],
  });
  document.getElementById("widgets").innerHTML = rendered;

  // Drag events
  const components = document.querySelectorAll("article.widget");
  const onDrag = (e) => ComponentOnDrag(e, widgetsMeta);
  for (component of components) {
    component.removeEventListener("dragstart", onDrag);
    component.addEventListener("dragstart", onDrag);
  }
};

const loadLayouts = async () => {
  const template = document.getElementById("layout-tmpl").innerText;
  const { layouts } = await Client.emit("vsch.ui.getLayouts");
  if (layouts && layouts.length) {
    const rendered = Mustache.render(template, {
      layouts,
    });
    document.getElementById("layouts").innerHTML = rendered;

    const layoutElements = document.getElementsByClassName("open-layout");

    for (const layout of layoutElements) {
      getDefaultState(layout)();
    }
  }
  Client.emit("vsch.ui.getEditmodeState");
};

Client.on("ui.editmodeState", ({ payload: { active, uid } }) => {
  const layout = getLayout(uid);
  if (layout) {
    const name = layout.getAttribute("data-name");
    if (active) {
      layout.innerText = `Freeze ${name}`;
      layout.onclick = () => Client.emit("vsch.ui.disableEditmode", { uid });
    } else {
      layout.innerText = `Edit ${name}`;
      layout.onclick = () => Client.emit("vsch.ui.enableEditmode", { uid });
    }
  }
});

Client.on("ui.isActive", ({ payload: { active, uid } }) => {
  const layout = getLayout(uid);
  if (layout) {
    if (active) {
      Client.emit("vsch.ui.getEditmodeState");
    } else {
      getDefaultState(layout, uid)();
    }
  }
});

const addLayoutBtn = document.getElementById("action-add-layout");
addLayoutBtn.onclick = () => Client.emit("vsch.ui.addLayout").then(loadLayouts);

const headingLayouts = document.getElementById("heading-layouts");
headingLayouts.onclick = () =>
  Client.emit("vscode.openFolder", { newWindow: true, path: "LAYOUTS_ROOT" });

const headingWidgets = document.getElementById("heading-widgets");
headingWidgets.onclick = () =>
  Client.emit("vscode.openFolder", { newWindow: true, path: "WIDGETS_ROOT" });

loadLayouts();
loadCustomWidgets();
