import { FocusEvent, FunctionComponentElement } from 'react';

export interface WidgetProps {
  id?: string;
  appearance: {
    title: string;
    color: string;
    hideTitlebar?: boolean;
    icon?: ChakraIcon;
  };
  data?: any;
  type?: string;
  layout?: {
    [id: string]: object;
  };
  x?: number;
  y?: number;
  onWidgetUpdate?: (data: WidgetProps) => void;
  onWidgetDelete?: () => void;
}

export interface ItemID {
  id?: string;
  MenuItem?: any;
}

export interface HeaderCallbacks {
  menu: {
    prepend: FunctionComponentElement<ItemID>;
    append: FunctionComponentElement<ItemID>;
  };
}

export interface HeaderProps {
  id?: string;
  title: string;
  alphaColor: string;
  hideTitlebar?: boolean;
  icon?: ChakraIcon;
  updateIcon: (icon: ChakraIcon) => void;
  updateName: (element: FocusEvent<HTMLElement>) => void;
  updateColor: (color: string) => void;
  toggleTitlebar: () => void;
  deleteWidget: () => void;
  callbacks?: HeaderCallbacks;
}

export interface MenuType {
  prepend: FunctionComponentElement<ItemID> | null;
  append: FunctionComponentElement<ItemID> | null;
}

export type ChakraIcon =
  | 'CopyIcon'
  | 'SearchIcon'
  | 'Search2Icon'
  | 'MoonIcon'
  | 'SunIcon'
  | 'AddIcon'
  | 'SmallAddIcon'
  | 'SettingsIcon'
  | 'CheckCircleIcon'
  | 'LockIcon'
  | 'UnlockIcon'
  | 'ViewIcon'
  | 'ViewOffIcon'
  | 'DownloadIcon'
  | 'DeleteIcon'
  | 'RepeatIcon'
  | 'RepeatClockIcon'
  | 'EditIcon'
  | 'ChevronLeftIcon'
  | 'ChevronRightIcon'
  | 'ChevronDownIcon'
  | 'ChevronUpIcon'
  | 'ArrowBackIcon'
  | 'ArrowForwardIcon'
  | 'ArrowUpIcon'
  | 'ArrowUpDownIcon'
  | 'ArrowDownIcon'
  | 'ExternalLinkIcon'
  | 'LinkIcon'
  | 'PlusSquareIcon'
  | 'CalendarIcon'
  | 'ChatIcon'
  | 'TimeIcon'
  | 'ArrowRightIcon'
  | 'ArrowLeftIcon'
  | 'AtSignIcon'
  | 'AttachmentIcon'
  | 'UpDownIcon'
  | 'StarIcon'
  | 'EmailIcon'
  | 'PhoneIcon'
  | 'DragHandleIcon'
  | 'SpinnerIcon'
  | 'CloseIcon'
  | 'SmallCloseIcon'
  | 'NotAllowedIcon'
  | 'TriangleDownIcon'
  | 'TriangleUpIcon'
  | 'InfoOutlineIcon'
  | 'BellIcon'
  | 'InfoIcon'
  | 'QuestionIcon'
  | 'QuestionOutlineIcon'
  | 'WarningIcon'
  | 'WarningTwoIcon'
  | 'CheckIcon'
  | 'MinusIcon'
  | 'HamburgerIcon';
