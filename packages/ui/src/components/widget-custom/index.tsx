import React from 'react';

import DynamicComponent from '@components/dynamic-component';
import { DynamicComponentProps } from '@components/dynamic-component/types';

const WidgetCustom = ({
  widget,
  id,
}: {
  widget: DynamicComponentProps;
  id: string;
}) => {
  return <DynamicComponent {...widget} id={id} />;
};

export default WidgetCustom;
