import React, { useContext } from 'react';
import { useSetRecoilState } from 'recoil';

import EventBus from '@hooks/event-bus';
import { $workbench } from '@state';

import Grid from '../grid';

const Dashboard = () => {
  const setFirstRecent = useSetRecoilState($workbench.recentlyOpened);
  const Bus = useContext(EventBus);

  Bus.emit('init', {}).then(({ recent }: any) => {
    if (recent) setFirstRecent(recent.workspaces);
  });

  return <Grid />;
};

export default Dashboard;
