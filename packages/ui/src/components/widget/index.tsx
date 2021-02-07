import React, { Suspense, lazy, useMemo } from 'react';

import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Skeleton,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
} from '@chakra-ui/icons';

const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time * 1000));

const Widget = ({ appearance, data, type }: any) => {
  const { title, color } = appearance;

  const content = useMemo(() => {
    const getter = async () => {
      await sleep(50);
      return await import(/* webpackPreload: true */ `../widget-collection`);
    };
    const widgetContent = getter();
    const Component = lazy(() => widgetContent);

    return (
      <Suspense fallback={<Skeleton height={8} />}>
        <Component />
      </Suspense>
    );
  }, [type, data]);

  return (
    <Box bg={color} borderRadius="sm" height="100%">
      <Box p={2} borderRadius="sm" fontSize="lg">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            size="xs"
            variant="outline"
          />
          <Portal>
            <MenuList>
              <MenuItem icon={<AddIcon />} command="⌘T">
                New Tab
              </MenuItem>
              <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
                New Window
              </MenuItem>
              <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
                Open Closed Tab
              </MenuItem>
              <MenuItem icon={<EditIcon />} command="⌘O">
                Open File...
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
        {title}
      </Box>
      <Divider />
      <Box className="selection-allowed" p={2} borderRadius="sm">
        {content}
      </Box>
    </Box>
  );
};
export default Widget;
