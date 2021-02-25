import React, { useContext, useEffect, useRef } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';

import EventBus from '@hooks/event-bus';
import { $workbench, $ui } from '@state';

import Grid from '../grid';

const Dashboard = () => {
  const setFirstRecent = useSetRecoilState($workbench.recentlyOpened);
  const [widgets, setWidgets] = useRecoilState($ui.widgets);
  const isInitialized = useRef(false);
  const Bus = useContext(EventBus);

  useEffect(() => {
    if (!isInitialized.current) return;
    Bus.emit('vsch.setLayout', {
      name: 'default',
      layout: widgets,
    });
  }, [widgets]);

  useEffect(() => {
    Bus.emit('vsch.getLayout', {}).then(({ layout }: any) => {
      if (layout) setWidgets(layout);
      isInitialized.current = true;
    });
    Bus.emit('workbench.getRecentlyOpened', {}).then(({ recent }: any) => {
      if (recent) setFirstRecent(recent.workspaces);
    });
  }, []);

  return <Grid />;
};

export default Dashboard;
