import EventBus from 'vsch-core/src/utils/EventBusClient.js';
import { ComponentType } from 'react';
export interface DynamicComponentProps {
  title?: string;
  lib: string;
  entry: string;
  instance: any;
}

interface UnpackWidgetArgs {
  Bus: EventBus;
  lib: string;
  entry: string;
}

export interface UnpackWidgetFn {
  (args: UnpackWidgetArgs): Promise<{
    default: ComponentType<React.PropsWithChildren<any>>;
  }>;
}

export interface VschLoadWidget {
  path: string;
}

export interface FetchWidgetArgs {
  lib: string;
  path: string;
}
