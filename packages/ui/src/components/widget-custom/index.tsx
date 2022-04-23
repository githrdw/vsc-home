import React from 'react';

import DynamicComponent from '@components/dynamic-component';
import { DynamicComponentProps } from '@components/dynamic-component/types';

const WidgetCustom = ({
  widget,
  id,
  updateData,
}: {
  widget: DynamicComponentProps;
  id: string;
  updateData: (data: any) => void;
}) => {
  return <DynamicComponent {...widget} id={id} updateData={updateData} />;
};

export default WidgetCustom;
