const props = {
  "minW": 2,
  "minH": 2,
  "moved": false,
  "static": false
}
export default {
  "layout": [
    {
      "id": "1",
      "appearance": {
        "title": "Welcome",
        "icon": "SunIcon",
        "color": "transparent",
        "hideTitlebar": true
      },
      "layout": {
        "sm": {
          "w": 6,
          "h": 6,
          "x": 0,
          "y": 1,
          "i": "1",
          ...props
        },
        "md": {
          "w": 7,
          "h": 5,
          "x": 2,
          "y": 4,
          "i": "1",
          ...props
        },
        "lg": {
          "w": 3,
          "h": 5,
          "x": 2,
          "y": 4,
          "i": "1",
          ...props
        },
        "xs": {
          "w": 4,
          "h": 6,
          "x": 0,
          "y": 1,
          "i": "1",
          ...props
        },
        "xxs": {
          "w": 2,
          "h": 6,
          "x": 0,
          "y": 1,
          "i": "1",
          ...props
        }
      },
      "data": {
        "raw": "<h1>Visual Studio Code</h1><h2>Editing evolved</h2>"
      },
      "type": "notes"
    },
    {
      "id": "2",
      "appearance": {
        "title": "Recent",
        "icon": "RepeatClockIcon",
        "color": "#71809633"
      },
      "layout": {
        "sm": {
          "w": 6,
          "h": 6,
          "x": 0,
          "y": 16,
          "i": "2",
          ...props
        },
        "md": {
          "w": 7,
          "h": 6,
          "x": 2,
          "y": 18,
          "i": "2",
          ...props
        },
        "lg": {
          "w": 4,
          "h": 10,
          "x": 2,
          "y": 18,
          "i": "2",
          ...props
        },
        "xs": {
          "w": 4,
          "h": 6,
          "x": 0,
          "y": 16,
          "i": "2",
          ...props
        },
        "xxs": {
          "w": 2,
          "h": 6,
          "x": 0,
          "y": 16,
          "i": "2",
          ...props
        }
      },
      "data": {
        "size": 8
      },
      "type": "recent"
    },
    {
      "id": "3",
      "appearance": {
        "title": "Quickstart",
        "icon": "ArrowRightIcon",
        "color": "#00000033"
      },
      "layout": {
        "sm": {
          "w": 6,
          "h": 9,
          "x": 0,
          "y": 7,
          "i": "3",
          ...props
        },
        "md": {
          "w": 7,
          "h": 9,
          "x": 2,
          "y": 9,
          "i": "3",
          ...props
        },
        "lg": {
          "w": 8,
          "h": 9,
          "x": 2,
          "y": 9,
          "i": "3",
          ...props
        },
        "xs": {
          "w": 4,
          "h": 9,
          "x": 0,
          "y": 7,
          "i": "3",
          ...props
        },
        "xxs": {
          "w": 2,
          "h": 9,
          "x": 0,
          "y": 7,
          "i": "3",
          ...props
        }
      },
      "data": {
        "raw": "<ol><li>Open the <strong>Home sidebar</strong></li><li>Drag one of the <strong>widgets</strong> into this dashboard</li><li><strong>Arrange and resize</strong> widgets by clicking \"Edit Home\" under Layouts</li><li>Create your own widget:</li></ol><ul><li>Click the \"Widgets\" title in the sidebar, this opens VS Code</li><li>In the opened widget directory, clone and build the widget template:</li></ul><pre><code>git clone git@github.com:githrdw/vsch-template.git vsch_Demo</code></pre><pre><code>cd vsch_Demo</code></pre><pre><code>yarn</code></pre><pre><code>yarn build</code></pre><ul><li>Now re-open the sidebar and see that \"Demo #1\" appeared as widget</li></ul>"
      },
      "type": "notes"
    },
    {
      "id": "4",
      "appearance": {
        "title": "Collection",
        "icon": "DragHandleIcon",
        "color": "#FFFFFF33"
      },
      "layout": {
        "sm": {
          "w": 6,
          "h": 6,
          "x": 0,
          "y": 22,
          "i": "4",
          ...props
        },
        "md": {
          "w": 7,
          "h": 6,
          "x": 2,
          "y": 24,
          "i": "4",
          ...props
        },
        "lg": {
          "w": 4,
          "h": 10,
          "x": 6,
          "y": 18,
          "i": "4",
          ...props
        },
        "xs": {
          "w": 4,
          "h": 6,
          "x": 0,
          "y": 22,
          "i": "4",
          ...props
        },
        "xxs": {
          "w": 2,
          "h": 6,
          "x": 0,
          "y": 22,
          "i": "4",
          ...props
        }
      },
      "data": {},
      "type": "collection"
    }
  ]
}