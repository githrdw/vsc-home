import React, { lazy, ReactElement, Suspense } from 'react';
import { Button, Progress, SimpleGrid } from '@chakra-ui/react';
import PopoverSelect from '@atoms/popover-select';
import { ChakraIcon } from '@components/widget/types';

const PopoverIcon = ({
  open,
  close,
  children,
  onIcon,
}: {
  open: boolean;
  close?: () => void;
  children: ReactElement;
  onIcon: (icon: ChakraIcon) => void;
}) => {
  const icons = (
    [
      'CopyIcon',
      'SearchIcon',
      'Search2Icon',
      'MoonIcon',
      'SunIcon',
      'AddIcon',
      'SmallAddIcon',
      'SettingsIcon',
      'CheckCircleIcon',
      'LockIcon',
      'UnlockIcon',
      'ViewIcon',
      'ViewOffIcon',
      'DownloadIcon',
      'DeleteIcon',
      'RepeatIcon',
      'RepeatClockIcon',
      'EditIcon',
      'ChevronLeftIcon',
      'ChevronRightIcon',
      'ChevronDownIcon',
      'ChevronUpIcon',
      'ArrowBackIcon',
      'ArrowForwardIcon',
      'ArrowUpIcon',
      'ArrowUpDownIcon',
      'ArrowDownIcon',
      'ExternalLinkIcon',
      'LinkIcon',
      'PlusSquareIcon',
      'CalendarIcon',
      'ChatIcon',
      'TimeIcon',
      'ArrowRightIcon',
      'ArrowLeftIcon',
      'AtSignIcon',
      'AttachmentIcon',
      'UpDownIcon',
      'StarIcon',
      'EmailIcon',
      'PhoneIcon',
      'DragHandleIcon',
      'SpinnerIcon',
      'CloseIcon',
      'SmallCloseIcon',
      'NotAllowedIcon',
      'TriangleDownIcon',
      'TriangleUpIcon',
      'InfoOutlineIcon',
      'BellIcon',
      'InfoIcon',
      'QuestionIcon',
      'QuestionOutlineIcon',
      'WarningIcon',
      'WarningTwoIcon',
      'CheckIcon',
      'MinusIcon',
      'HamburgerIcon',
    ] as ChakraIcon[]
  ).map(name => {
    const getter = async () => {
      const { [name]: element } = await import(
        /* webpackPreload: true */ `@chakra-ui/icons`
      );
      if (element) return { default: element };
      else {
        const { StarIcon } = await import('@chakra-ui/icons');
        return { default: StarIcon };
      }
    };
    const Component = lazy(() => getter());

    return (
      <Button
        key={name}
        onClick={() => onIcon(name)}
        height="22px"
        width="22px"
      >
        <Suspense fallback={<Progress size="xs" isIndeterminate />}>
          <Component />
        </Suspense>
      </Button>
    );
  });
  return (
    <PopoverSelect {...{ open, close, activator: children }}>
      <SimpleGrid columns={5} spacing={2} p={2}>
        {icons}
      </SimpleGrid>
    </PopoverSelect>
  );
};

export default PopoverIcon;
