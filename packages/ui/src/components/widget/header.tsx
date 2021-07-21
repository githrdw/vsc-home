import React, { useState, cloneElement } from 'react';

import {
  Divider,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spacer,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  DeleteIcon,
  StarIcon,
  SunIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';

import ColorPopover from '@atoms/color-popover';
import IconPlaceholder from './icon-placeholder';
import { HeaderProps, MenuType } from './types';

const Header = ({
  id,
  title,
  alphaColor,
  hideTitlebar,
  updateName,
  deleteWidget,
  updateColor,
  toggleTitlebar,
  callbacks,
}: HeaderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [CustomMenu, setMenu] = useState<MenuType>({
    prepend: null,
    append: null,
  });

  const renderCustomItems = () => {
    setMenu({
      prepend: callbacks?.menu?.prepend
        ? cloneElement(callbacks?.menu?.prepend, { id })
        : null,
      append: callbacks?.menu?.append
        ? cloneElement(callbacks?.menu?.append, { id })
        : null,
    });
  };

  return (
    <>
      <Flex p={2} fontSize="lg" align="center">
        <IconPlaceholder bg={alphaColor}>
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
        <Menu placement="bottom" onOpen={renderCustomItems}>
          <ColorPopover
            open={popoverOpen}
            close={() => setPopoverOpen(false)}
            onColor={updateColor}
          >
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              size="xs"
              variant="outline"
            />
          </ColorPopover>
          <Portal>
            <MenuList>
              {CustomMenu.prepend}
              {CustomMenu.prepend && <Divider />}
              <MenuItem onClick={() => setPopoverOpen(true)} icon={<SunIcon />}>
                Change color
              </MenuItem>
              <MenuItem
                onClick={toggleTitlebar}
                icon={hideTitlebar ? <ViewIcon /> : <ViewOffIcon />}
              >
                {hideTitlebar ? 'Show' : 'Hide'} titlebar
              </MenuItem>
              <MenuItem onClick={deleteWidget} icon={<DeleteIcon />}>
                Delete
              </MenuItem>
              {CustomMenu.append && <Divider />}
              {CustomMenu.append}
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
      <Divider m={0} mt="-1px" />
    </>
  );
};

export default Header;
