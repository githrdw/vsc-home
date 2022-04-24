import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';

import EventBus from '@hooks/event-bus';
import { $workbench, $ui } from '@state';

import Grid from '../grid';
import AuthManager from '../auth-manager';

const Dashboard = () => {
  const setFirstRecent = useSetRecoilState($workbench.recentlyOpened);
  const [editMode, setEditmode] = useRecoilState($ui.editMode);
  const [widgets, setWidgets] = useRecoilState($ui.widgets);
  const [credentialWindowOpen, setCredentialWindowOpen] = useState(false);
  const authPromise = useRef<{}>();
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
      Bus.on(
        'ui.requestAuthentication',
        ({ payload: { providerName, _node }, resolve }: any) => {
          authPromise.current = { resolve, providerName, _node };
          setCredentialWindowOpen(true);
        }
      ),
      Bus.on(
        'ui.getProviderToken',
        async ({ payload: { providerHash }, resolve }: any) => {
          const token = await Bus.emit('auth.getProviderToken', {
            providerHash,
          });
          resolve(token);
        }
      ),
    ]);
  }, []);

  return (
    <>
      <Grid />
      <AuthManager
        isOpen={credentialWindowOpen}
        onClose={() => setCredentialWindowOpen(false)}
        authPromise={authPromise.current}
      />
    </>
  );
};

export default Dashboard;
