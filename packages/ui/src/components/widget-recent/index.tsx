import React from 'react';

import { useRecoilState } from 'recoil';
import { $workbench } from '@state';

import WidgetCollection from '@components/widget-collection';

const WidgetRecent = ({ size = 5 }) => {
  const [recentItems]: any = useRecoilState($workbench.recentlyOpened);

  return <WidgetCollection items={recentItems} size={size} />;
};

export default WidgetRecent;
