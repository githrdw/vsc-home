import React, { useContext } from 'react';
import { useSetRecoilState } from 'recoil';

import EventBus from '@hooks/event-bus';
import { $workbench, $ui } from '@state';

import Grid from '../grid';

const Dashboard = () => {
  const setFirstRecent = useSetRecoilState($workbench.recentlyOpened);
  const setWidgets = useSetRecoilState($ui.widgets);
  const Bus = useContext(EventBus);

  Bus.emit('workbench.getRecentlyOpened', {}).then(({ recent }: any) => {
    if (recent) setFirstRecent(recent.workspaces);
  });
  Bus.emit('vsch.getLayout', {}).then(({ layout }: any) => {
    console.warn({ layout });
    if (layout) setWidgets(layout);
  });

  return <Grid />;
};

export default Dashboard;
