import React from 'react';

import DynamicComponent from '@components/dynamic-component';

const WidgetActions = () => {
  return <DynamicComponent name="app2" entry="./Widget" />;
};

export default WidgetActions;
