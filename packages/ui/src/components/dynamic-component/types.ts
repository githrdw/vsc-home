import EventBus from '@hooks/event-bus/instance';
import { ComponentType } from 'react';
export interface DynamicComponentProps {
  name: string;
  entry: string;
}

interface UnpackWidgetArgs {
  Bus: EventBus;
  name: string;
  entry: string;
}

export interface UnpackWidgetFn {
  (args: UnpackWidgetArgs): Promise<{ default: ComponentType<any> }>;
}

export interface VschLoadWidget {
  path: string;
}

export interface FetchWidgetArgs {
  name: string;
  path: string;
}
