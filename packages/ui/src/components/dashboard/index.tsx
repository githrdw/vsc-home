import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';

import EventBus from '@hooks/event-bus';
import { $workbench, $ui } from '@state';

import Grid from '../grid';

const Dashboard = () => {
  const setFirstRecent = useSetRecoilState($workbench.recentlyOpened);
  const [editMode, setEditmode] = useRecoilState($ui.editMode);
  const [widgets, setWidgets] = useRecoilState($ui.widgets);
  const isInitialized = useRef(false);
  const Bus = useContext(EventBus);

  useEffect(() => {
    if (!isInitialized.current) return;
    Bus.emit('vsch.ui.setLayout', {
      name: 'default',
      layout: widgets,
    });
  }, [widgets]);

  const emitEditmode = useCallback(() => {
    Bus.emit('vsch.ui.editmodeState', { active: editMode });
  }, [editMode]);

  useEffect(() => {
    Bus.emit('vsch.ui.getLayout', {}).then(({ layout }: any) => {
      if (layout) setWidgets(layout);
      isInitialized.current = true;
    });
    Bus.emit('workbench.getRecentlyOpened', {}, true).then(
      ({ recent }: any) => {
        if (recent) setFirstRecent(recent.workspaces);
      }
    );
  }, []);

  Bus.on('ui.enableEditmode', () => setEditmode(true));
  Bus.on('ui.disableEditmode', () => setEditmode(false));
  Bus.on('ui.getEditmodeState', emitEditmode);

  useEffect(emitEditmode, [editMode]);

  return <Grid />;
};

export default Dashboard;
