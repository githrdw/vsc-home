import React, { Suspense, lazy, useMemo, FocusEvent } from 'react';

import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Progress,
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
import { WidgetProps } from './types';

const Widget = ({ onWidgetUpdate, ...widgetMeta }: WidgetProps) => {
  const { appearance, data, type } = widgetMeta;
  const { title, color } = appearance;

  const updateName = ({ target: { innerText } }: FocusEvent<HTMLElement>) => {
    if (innerText !== title)
      onWidgetUpdate?.({
        ...widgetMeta,
        appearance: { title: innerText, color },
      });
  };

  const content = useMemo(() => {
    const getter = async () =>
      await import(/* webpackPreload: true */ `../widget-${type}`);
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
        <Heading
          size="sm"
          w="calc(100% - 3.7rem)"
          m={0}
          ml="3.5rem"
          p=".6rem"
          position="absolute"
          left={0}
          whiteSpace="nowrap"
          overflow="hidden"
          suppressContentEditableWarning={true}
          onBlur={updateName}
          contentEditable
        >
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
      <Box
        className="selection-allowed"
        px={2}
        py={3}
        borderRadius="sm"
        overflow="auto"
        height="calc(100% - 34px)"
      >
        {content}
        {/* <Input /> */}
      </Box>
    </Box>
  );
};
export default Widget;
