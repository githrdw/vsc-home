import React, { useMemo, useContext, createElement } from 'react';
import { useRecoilState } from 'recoil';
import { ButtonGroup, MenuItem } from '@chakra-ui/react';
import { VscFileSubmodule, VscFile, VscFolder } from 'react-icons/vsc';
import { $ui } from '../../state';

import { FsTypes, WidgetCollectionProps, FileList } from './interfaces';
import ListItem from '@atoms/list-item';
import { AddIcon } from '@chakra-ui/icons';
import EventBus from '@hooks/event-bus';

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

const CollectionMenu = createElement((meta: { id?: string }) => {
  const Bus = useContext(EventBus);
  const [widgets, setWidgets] = useRecoilState($ui.widgets);

  const selectFolder = async () => {
    const { data }: { data?: FileList } = await Bus.emit(
      'vscode.selectFolder',
      {
        canSelectFolders: true,
        canSelectMany: true,
      }
    );
    const widget = widgets.find(({ id }) => id === meta.id);
    const items = widget?.data?.items;

    if (widget && items && data) {
      for (const entry of data) {
        items.push({ type: 'workspace', path: entry.path });
      }
      widget.data = { ...widget.data, items };
      setWidgets([...widgets]);
    }
  };
  return (
    <MenuItem icon={<AddIcon />} onClick={selectFolder}>
      Add folder
    </MenuItem>
  );
});

const WidgetCollection = ({
  size = 5,
  items,
  setCallbacks,
}: WidgetCollectionProps) => {
  if (setCallbacks) {
    setCallbacks({
      menu: {
        prepend: CollectionMenu,
      },
    });
  }
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
