import React, { useContext, useEffect, useRef } from 'react';
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

  const uid = (window as any).VSCH_UID || 'default';

  useEffect(() => {
    if (!isInitialized.current) return;
    Bus.emit('vsch.ui.setLayout', {
      uid,
      layout: widgets,
    });
  }, [widgets]);

  useEffect(() => {
    Bus.emit('vsch.ui.editmodeState', { active: editMode, uid });
    return Bus.off(
      Bus.on('ui.getEditmodeState', () => {
        Bus.emit('vsch.ui.editmodeState', { active: editMode, uid });
      })
    );
  }, [editMode]);

  useEffect(() => {
    Bus.emit('vsch.ui.getLayout', {
      uid,
    }).then(({ layout }: any) => {
      if (layout) setWidgets(layout);
      isInitialized.current = true;
    });
    Bus.emit('workbench.getRecentlyOpened', {}, true).then(
      ({ recent }: any) => {
        if (recent) setFirstRecent(recent.workspaces);
      }
    );

    return Bus.off([
      Bus.on('ui.enableEditmode', ({ payload: { uid: _uid } }: any) => {
        if (_uid === uid) setEditmode(true);
      }),
      Bus.on('ui.disableEditmode', ({ payload: { uid: _uid } }: any) => {
        if (_uid === uid) setEditmode(false);
      }),
    ]);
  }, []);

  return <Grid />;
};

export default Dashboard;
