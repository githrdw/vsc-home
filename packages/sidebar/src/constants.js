const WIDGET_META = {
  appearance: {
    title: "Component",
    icon: "star",
    color: "black.2"
  },
  layout: {
    sm: {
      w: 2,
      h: 4,
      minW: 2,
      minH: 2
    },
    md: {
      w: 2,
      h: 4,
      minW: 2,
      minH: 2
    },
    lg: {
      w: 2,
      h: 4,
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
    subtitle: "Editable list of folders (and workspaces)"
  },
  {
    id: "notes",
    title: "Notes",
    subtitle: "WYSIWYG editor for taking notes"
  },
  {
    id: "repositories",
    title: "Remote repositories",
    subtitle: "List of remote repositories"
  },
  {
    id: "iframe",
    title: "Iframe",
    subtitle: "Embed your favorite page"
  }
]

export { WIDGET_META, BUILTIN_WIDGETS }