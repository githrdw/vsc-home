import { RecentItem } from '@components/widget-collection/interfaces';
import { atom } from 'recoil';

const $recentlyOpened = atom<RecentItem[]>({
  key: 'workbench.recentlyOpened',
  default: [],
});

export const recentlyOpened = $recentlyOpened;
