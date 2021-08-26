import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import React from 'react';

const PopoverSelect = ({
  open,
  close,
  activator,
  children,
  placement,
}: any) => {
  return (
    <Popover
      isOpen={open}
      returnFocusOnClose={false}
      closeOnBlur
      onClose={close}
      placement={'bottom' || placement}
    >
      <PopoverTrigger>{activator}</PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          {children}
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default PopoverSelect;
