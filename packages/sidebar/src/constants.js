const WIDGET_META = {
  appearance: {
    title: "Component",
    icon: "star",
    color: "black.2"
  },
  layout: {
    sm: {
      w: 6,
      h: 6,
      minW: 2,
      minH: 2
    },
    md: {
      w: 3,
      h: 6,
      minW: 2,
      minH: 2
    },
    lg: {
      w: 3,
      h: 6,
      minW: 2,
      minH: 2
    }
  },
  data: {}
}

const BUILTIN_WIDGETS = [
  {
    id: "recent",
    title: "Recent projects",
    subtitle: "List of recent opened folders and workspaces"
  },
  {
    id: "collection",
    title: "Collection",
    subtitle: "Editable list of recent folders and workspaces"
  },
  {
    id: "notes",
    title: "Notes",
    subtitle: "WYSIWYG editor for taking notes"
  },
]

export { WIDGET_META, BUILTIN_WIDGETS }