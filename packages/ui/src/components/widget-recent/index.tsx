import React, { useMemo } from 'react';

import { useRecoilValue } from 'recoil';
import { $workbench } from '@state';

import WidgetCollection from '@components/widget-collection';
import { FsTypes } from '@components/widget-collection/interfaces';

const WidgetRecent = ({ size = 5 }) => {
  const recentItems = useRecoilValue($workbench.recentlyOpened);
  const recentItemsCollection = useMemo(() => {
    const recent = recentItems.map(item => {
      const type = item.workspace
        ? FsTypes.Workspace
        : item.folderUri
        ? FsTypes.Folder
        : FsTypes.File;
      const path =
        (item.workspace
          ? item.workspace.configPath.path
          : item.folderUri?.path) || '';
      return {
        type,
        path,
        name: path,
      };
    });
    return recent;
  }, [recentItems]);

  return <WidgetCollection items={recentItemsCollection} size={size} />;
};

export default WidgetRecent;
