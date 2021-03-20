import React, { useMemo } from 'react';
import { ButtonGroup } from '@chakra-ui/react';
import { VscFileSubmodule, VscFile, VscFolder } from 'react-icons/vsc';

import { FsTypes, WidgetCollectionProps } from './interfaces';
import ListItem from '@atoms/list-item';

const getIcon = (type: FsTypes) => {
  const Icon = () => {
    const Component =
      type === FsTypes.Workspace
        ? VscFileSubmodule
        : type === FsTypes.Folder
        ? VscFolder
        : VscFile;
    return <Component height="14px" />;
  };
  return Icon;
};

const WidgetCollection = ({ size = 5, items }: WidgetCollectionProps) => {
  const ItemList = useMemo(() => {
    const Children = [];
    if (items) {
      for (const { path, name, type } of items.slice(0, size)) {
        Children.push(
          <div key={path}>
            <ListItem {...{ Icon: getIcon(type), name, path }} />
          </div>
        );
      }
    }
    return Children;
  }, [items]);

  return (
    <>
      <ButtonGroup display="block" spacing={0} variant="ghost">
        {ItemList}
      </ButtonGroup>
    </>
  );
};

export default WidgetCollection;
