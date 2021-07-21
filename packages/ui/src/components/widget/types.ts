import { FocusEvent, FunctionComponentElement } from 'react';

export interface WidgetProps {
  id?: string;
  appearance: {
    title: string;
    color: string;
    hideTitlebar?: boolean;
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

type ItemID = {
  id?: string;
};

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
  callbacks?: HeaderCallbacks;
  updateName: (element: FocusEvent<HTMLElement>) => void;
  updateColor: (color: string) => void;
  toggleTitlebar: () => void;
  deleteWidget: () => void;
}

export interface MenuType {
  prepend: FunctionComponentElement<ItemID> | null;
  append: FunctionComponentElement<ItemID> | null;
}
