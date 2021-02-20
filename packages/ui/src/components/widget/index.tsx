import React, { Suspense, lazy, useMemo } from 'react';

import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Progress,
  Skeleton,
  Spacer,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
  StarIcon,
} from '@chakra-ui/icons';

import IconPlaceholder from './icon-placeholder';

const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time * 1000));

const Widget = ({ appearance, data, type }: any) => {
  const { title, color } = appearance;

  const content = useMemo(() => {
    const getter = async () => {
      // await sleep(2);
      return await import(/* webpackPreload: true */ `../widget-${type}`);
    };
    const widgetContent = getter();
    const Component = lazy(() => widgetContent);

    return (
      <Suspense fallback={<Progress size="xs" isIndeterminate />}>
        <Component {...data} />
      </Suspense>
    );
  }, [type, data]);

  return (
    <Box bg={color} height="100%">
      <Flex p={2} fontSize="lg" align="center">
        <IconPlaceholder bg={color}>
          <StarIcon w={5} h={4} />
        </IconPlaceholder>
        <Heading size="sm" m={0}>
          {title}
        </Heading>
        <Spacer />
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
      </Flex>
      <Divider m={0} mt="-1px" />
      <Box className="selection-allowed" px={2} py={3} borderRadius="sm">
        {content}
        {/* <Input /> */}
      </Box>
    </Box>
  );
};
export default Widget;
