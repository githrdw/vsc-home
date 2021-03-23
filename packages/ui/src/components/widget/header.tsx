import React, { useState } from 'react';

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
import { HeaderProps } from './types';

const Header = ({
  title,
  alphaColor,
  hideTitlebar,
  updateName,
  deleteWidget,
  updateColor,
  toggleTitlebar,
}: HeaderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

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
        <Menu placement="bottom">
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
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
      <Divider m={0} mt="-1px" />
    </>
  );
};

export default Header;
