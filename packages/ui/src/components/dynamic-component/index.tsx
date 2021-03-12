/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { Suspense, useContext } from 'react';
import EventBus from '@hooks/event-bus';
import {
  DynamicComponentProps,
  UnpackWidgetFn,
  FetchWidgetArgs,
} from './types';

// Inspiration: https://github.com/module-federation/module-federation-examples
const fetchWidget = ({ lib, path }: FetchWidgetArgs) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = path;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = resolve;
    script.onerror = () => reject(`Failed to import widget ${lib}`);

    document.head.appendChild(script);
  });
};

const unpackWidget: UnpackWidgetFn = async ({ Bus, lib, entry }) => {
  // Resolve the uri path to the widget through API Core
  const { path }: any = await Bus.emit('vsch.core.loadCustomWidget', { lib });
  const globalName = `vsch_${lib}`;

  if (!path) throw new Error('No plugin path returned from API');
  // @ts-ignore: load widget script if global widget variable is not set
  if (!window[globalName]) {
    try {
      await fetchWidget({ lib, path });
      // @ts-ignore: because __webpack variables are not defined
      await __webpack_init_sharing__('default');

      // @ts-ignore: because init is not yet defined and __webpack does not exists
      await window[globalName].init(__webpack_share_scopes__.default);
      // @ts-ignore: because future component is not yet resolvable in window
      const module = await window[globalName].get(entry);
      // @ts-ignore: remove global variable
      window[globalName] = undefined;
      return module();
    } catch {
      console.error(`Failed to import widget ${lib}`);
    }
  }
};

const DynamicComponent = ({ lib, entry }: DynamicComponentProps) => {
  const Bus = useContext(EventBus);
  const Widget = React.lazy(() =>
    unpackWidget({
      Bus,
      lib,
      entry,
    })
  );
  return (
    <Suspense fallback="Loading widget">
      <Widget />
    </Suspense>
  );
};

export default DynamicComponent;
