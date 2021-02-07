export const defaultLayout = [
  {
    id: '1',
    type: 'collection',
    layout: {
      sm: { x: 0, y: 0, w: 6, h: 3, static: false },
      md: { x: 0, y: 0, w: 3, h: 3, static: false },
      lg: { x: 0, y: 0, w: 3, h: 3, static: false },
    },
    appearance: {
      title: 'Booster',
      icon: 'star',
      color: 'green.2',
    },
    data: {
      items: [
        { type: 'workspace', path: 'C:/Users/ruben', name: 'Root' },
        { type: 'folder', path: 'C:/Users/ruben', name: 'Root' },
        { type: 'file', path: 'C:/Users/ruben', name: 'Root' },
      ],
    },
  },
];
