import React from 'react';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { $workbench } from '../../state';

import Grid from '../grid';

declare let acquireVsCodeApi: any;
const vscode =
  typeof acquireVsCodeApi === 'undefined' ? null : acquireVsCodeApi();

console.warn({ vscode });

const Dashboard = () => {
  const [firstRecent, setFirstRecent] = useRecoilState(
    $workbench.recentlyOpened
  );

  useEffect(() => {
    window.addEventListener('message', ({ data }) => {
      const { recent } = data;
      setFirstRecent(recent.workspaces[1].folderUri.path);
    });

    vscode?.postMessage({
      command: 'init',
    });
    console.timeEnd('init');
  }, []);

  return <Grid />;
};

export default Dashboard;
