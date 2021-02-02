import { atom } from 'recoil';

export const $recentOpened = atom({
  key: 'workbench.recentOpened',
  default: [],
});

const mdAndUp = [
  { i: 'a', x: 0, y: 0, w: 3, h: 3, static: true },
  { i: 'b', x: 3, y: 0, w: 3, h: 3, minW: 2, maxW: 4 },
  { i: 'c', x: 6, y: 0, w: 3, h: 3 },
  { i: 'e', x: 9, y: 0, w: 3, h: 3 },
  { i: 'd', x: 9, y: 1, w: 6, h: 3 },
];

export const $layouts = atom({
  key: 'ui.layouts',
  // TODO: Sync atom with layout settings
  // effects_UNSTABLE: () => {},
  default: {
    sm: [
      { i: 'a', x: 0, y: 0, w: 6, h: 3, static: true },
      { i: 'b', x: 1, y: 0, w: 6, h: 2, minW: 2, maxW: 4 },
      { i: 'c', x: 2, y: 0, w: 6, h: 3 },
      { i: 'e', x: 3, y: 0, w: 6, h: 3 },
      { i: 'd', x: 4, y: 0, w: 6, h: 3 },
    ],
    md: mdAndUp,
    lg: mdAndUp,
  },
});
