import { atom } from 'recoil';

const $recentlyOpened = atom({
  key: 'workbench.recentlyOpened',
  default: [],
});

export const recentlyOpened = $recentlyOpened;
