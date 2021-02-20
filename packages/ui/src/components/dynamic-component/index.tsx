/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { Suspense, useContext } from 'react';
import EventBus from '@hooks/event-bus';
import {
  DynamicComponentProps,
  UnpackWidgetFn,
  FetchWidgetArgs,
} from './types';

const unpackWidget: UnpackWidgetFn = async ({ Bus, name, entry }) => {
  // Resolve the uri path to the widget through API Core
  const { path }: any = await Bus.emit('vsch.loadWidget', {});
  if (!path) throw new Error('No plugin path returned from API');
  // @ts-ignore: load widget script if global widget variable is not set
  if (!window[name]) await fetchWidget({ name, path });
  // @ts-ignore: because __webpack variables are not defined
  await __webpack_init_sharing__('default');

  // @ts-ignore: because init is not yet defined and __webpack does not exists
  await window[name].init(__webpack_share_scopes__.default);
  // @ts-ignore: because future component is not yet resolvable in window
  const module = await window[name].get(entry);

  return module();
};

// Inspiration: https://github.com/module-federation/module-federation-examples
const fetchWidget = ({ name, path }: FetchWidgetArgs) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = path;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = resolve;
    script.onerror = () => reject(`Failed to import widget ${name}`);

    document.head.appendChild(script);
  });
};

const DynamicComponent = ({ name, entry }: DynamicComponentProps) => {
  const Bus = useContext(EventBus);

  const Widget = React.lazy(() =>
    unpackWidget({
      Bus,
      name,
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
