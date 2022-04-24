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
  SunIcon,
  ViewIcon,
  ViewOffIcon,
  DragHandleIcon,
} from '@chakra-ui/icons';

import ColorPopover from '@atoms/popover-color';
import IconPopover from '@atoms/popover-icon';
import IconPlaceholder from './icon-placeholder';
import { HeaderProps, MenuType } from './types';

const Header = ({
  id,
  title,
  alphaColor,
  hideTitlebar,
  icon,
  updateIcon,
  updateName,
  updateColor,
  toggleTitlebar,
  deleteWidget,
  callbacks,
}: HeaderProps) => {
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [iconPopoverOpen, setIconPopoverOpen] = useState(false);
  const [CustomMenu, setMenu] = useState<MenuType>({
    prepend: null,
    append: null,
  });

  const renderCustomItems = () => {
    setMenu({
      prepend: callbacks?.menu?.prepend
        ? cloneElement(callbacks?.menu?.prepend, { id, MenuItem })
        : null,
      append: callbacks?.menu?.append
        ? cloneElement(callbacks?.menu?.append, { id, MenuItem })
        : null,
    });
  };

  return (
    <>
      <Flex p={2} fontSize="lg" align="center">
        <Menu placement="bottom">
          <IconPopover
            open={iconPopoverOpen}
            onIcon={icon => {
              setIconPopoverOpen(false);
              updateIcon(icon);
            }}
          >
            <MenuButton
              aria-label="Icon"
              as="span"
              style={{ width: 28 }}
              onClick={() => setIconPopoverOpen(false)}
            >
              <IconPlaceholder icon={icon || 'StarIcon'} bg={alphaColor} />
            </MenuButton>
          </IconPopover>
        </Menu>
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
            open={colorPopoverOpen}
            close={() => setColorPopoverOpen(false)}
            onColor={(color: string) => {
              updateColor(color);
              setColorPopoverOpen(false);
            }}
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
              <MenuItem
                onClick={() => setColorPopoverOpen(true)}
                icon={<SunIcon />}
              >
                Change color
              </MenuItem>
              <MenuItem
                onClick={() => setIconPopoverOpen(true)}
                icon={<DragHandleIcon />}
              >
                Change icon
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
