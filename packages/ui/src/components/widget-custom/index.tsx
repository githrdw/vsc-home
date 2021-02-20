import React from 'react';

import DynamicComponent from '@components/dynamic-component';

const WidgetCustom = ({ widget }: any) => {
  return <DynamicComponent {...widget} />;
};

export default WidgetCustom;
