import React, { useMemo, useContext, createElement, useState } from 'react';
import { useRecoilState } from 'recoil';
import { ButtonGroup, MenuItem } from '@chakra-ui/react';
import {
  VscFileSubmodule,
  VscFile,
  VscFolder,
  VscRemote,
} from 'react-icons/vsc';
import { $ui } from '../../state';

import { FsTypes, WidgetCollectionProps, FileList } from './interfaces';
import ListItem from '@atoms/list-item';
import { MinusIcon } from '@chakra-ui/icons';
import EventBus from '@hooks/event-bus';

const getIcon = (type: FsTypes) => {
  const Icon = () => {
    const Component =
      type === FsTypes.Workspace
        ? VscFileSubmodule
        : type === FsTypes.Folder
        ? VscFolder
        : type === FsTypes.Uri
        ? VscRemote
        : VscFile;
    return <Component height="14px" />;
  };
  return Icon;
};

const deleteModeRefs = new Map<string, (() => void) | undefined>();
const addItemRefs = new Map<
  string,
  ((isWorkspace?: boolean) => void) | undefined
>();

const CollectionMenu = (id: string) =>
  createElement(() => {
    const deleteMode = deleteModeRefs.get(id) || void 0;
    const addItem = addItemRefs.get(id) || void 0;
    return (
      <>
        <MenuItem icon={<VscFolder />} onClick={() => addItem?.()}>
          Add folder
        </MenuItem>
        <MenuItem icon={<VscFileSubmodule />} onClick={() => addItem?.(true)}>
          Add workspace
        </MenuItem>

        <MenuItem icon={<MinusIcon />} onClick={deleteMode}>
          Remove item
        </MenuItem>
      </>
    );
  });

const WidgetCollection = ({
  id,
  size,
  items,
  setCallbacks,
}: WidgetCollectionProps) => {
  const Bus = useContext(EventBus);
  const [widgets, setWidgets] = useRecoilState($ui.widgets);
  const [removeMode, setRemoveMode] = useState(false);

  const widget = widgets.find(({ id: _id }) => _id === id);

  deleteModeRefs.set(id, () => setRemoveMode(!removeMode));
  addItemRefs.set(id, async (isWorkspace = false) => {
    const filters = {
      Workspace: ['code-workspace'],
    };
    const { data }: { data?: FileList } = await Bus.emit(
      'vscode.selectResource',
      {
        canSelectFolders: !isWorkspace,
        canSelectMany: true,
        filters: isWorkspace && filters,
      }
    );

    if (widget && widget.data) {
      const items = widget.data.items || [];

      if (items && data) {
        for (const entry of data) {
          items.push({
            type: isWorkspace ? 'workspace' : 'folder',
            path: entry.path,
          });
        }
        widget.data = { ...widget.data, items };
        setWidgets([...widgets]);
      }
    }
  });

  if (setCallbacks) {
    setCallbacks({
      menu: {
        prepend: CollectionMenu(id),
      },
    });
  }
  const ItemList = useMemo(() => {
    const Children = [];
    if (items) {
      for (const item of items.slice(0, size)) {
        const { path, name, label, type } = item;
        const Icon = removeMode ? MinusIcon : getIcon(type);
        const onClick = removeMode
          ? () => {
              items.splice(items.indexOf(item), 1);

              if (widget && widget.data && items) {
                widget.data = { ...widget.data, items };
                setWidgets([...widgets]);
              }
            }
          : () => {
              Bus.emit('vscode.openFolder', { path, type }).catch(() =>
                console.error('Something went wrong')
              );
            };
        Children.push(
          <div key={path}>
            <ListItem {...{ Icon, name, label, path, onClick }} />
          </div>
        );
      }
    }
    return Children;
  }, [items, removeMode]);

  return (
    <ButtonGroup display="block" spacing={0} variant="ghost">
      {ItemList}
    </ButtonGroup>
  );
};

export default WidgetCollection;
