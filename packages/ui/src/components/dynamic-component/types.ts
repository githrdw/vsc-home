import EventBus from '@hooks/event-bus/instance';
import { ComponentType } from 'react';
export interface DynamicComponentProps {
  lib: string;
  entry: string;
}

interface UnpackWidgetArgs {
  Bus: EventBus;
  lib: string;
  entry: string;
}

export interface UnpackWidgetFn {
  (args: UnpackWidgetArgs): Promise<{ default: ComponentType<any> }>;
}

export interface VschLoadWidget {
  path: string;
}

export interface FetchWidgetArgs {
  lib: string;
  path: string;
}
