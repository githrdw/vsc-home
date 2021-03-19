import { FocusEvent } from 'react';

export interface WidgetProps {
  id?: string;
  appearance: {
    title: string;
    color: string;
    hideTitlebar?: boolean;
  };
  data?: {};
  type?: string;
  layout?: {
    [id: string]: object;
  };
  x?: number;
  y?: number;
  onWidgetUpdate?: (data: WidgetProps) => void;
  onWidgetDelete?: () => void;
}

export interface HeaderProps {
  title: string;
  alphaColor: string;
  updateName: (element: FocusEvent<HTMLElement>) => void;
  deleteWidget: () => void;
}
