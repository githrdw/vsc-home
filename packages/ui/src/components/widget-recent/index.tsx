import React, { useMemo, createElement, useState } from 'react';

import { useRecoilValue } from 'recoil';
import { $workbench } from '@state';
import { Flex, Spacer, Input } from '@chakra-ui/react';
import { VscListUnordered } from 'react-icons/vsc';

import { WidgetRecentProps } from './interfaces';
import { FsTypes } from '@components/widget-collection/interfaces';

import WidgetCollection from '@components/widget-collection';

let updateSizeKey: ((size: number) => void) | undefined;
let sizeKey: number | undefined;

const RecentMenu = createElement(() => {
  const [size, setSize] = useState(sizeKey);
  const log = ({ target: { value } }: any) => {
    setSize(value);
    updateSizeKey?.(parseInt(value || ''));
  };
  return (
    <>
      <Flex py=".4rem" px=".8rem">
        <Flex as="span" pe=".75rem" alignItems="center">
          <VscListUnordered />
        </Flex>
        Size
        <Spacer />
        <Input
          type="number"
          value={size}
          size="xs"
          w={42}
          variant="filled"
          onInput={log}
        />
      </Flex>
    </>
  );
});

const WidgetRecent = ({
  id = '',
  size = 5,
  setCallbacks,
  updateData,
}: WidgetRecentProps) => {
  const recentItems = useRecoilValue($workbench.recentlyOpened);

  updateSizeKey = size => updateData?.((update: any) => update({ size }));
  sizeKey = size;

  if (setCallbacks) {
    setCallbacks({
      menu: {
        prepend: RecentMenu,
      },
    });
  }

  const recentItemsCollection = useMemo(() => {
    const recent = recentItems.map(item => {
      const type = item.workspace
        ? FsTypes.Workspace
        : item.folderUri
        ? item.folderUri.external
          ? FsTypes.Uri
          : FsTypes.File
        : FsTypes.File;
      const path =
        (type === FsTypes.Workspace
          ? item.workspace?.configPath.path
          : type === FsTypes.Uri
          ? item.folderUri?.external
          : item.folderUri?.path) || '';
      return {
        type,
        path,
        name: path,
      };
    });
    return recent;
  }, [recentItems]);

  return <WidgetCollection id={id} items={recentItemsCollection} size={size} />;
};

export default WidgetRecent;
