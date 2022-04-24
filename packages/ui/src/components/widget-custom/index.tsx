import React from 'react';

import DynamicComponent from '@components/dynamic-component';
import { DynamicComponentProps } from '@components/dynamic-component/types';

const WidgetCustom = ({
  widget,
  updateData,
  ...instance
}: {
  widget: DynamicComponentProps;
  updateData: (data: any) => any;
  instance: any;
}) => {
  let setInstance: any;
  const _instance: any = {
    ...instance,
    setInstance: (callback: any) => (setInstance = callback),
    updateData: (newData: any) => {
      const data = updateData(newData);
      setInstance?.({ ...instance, ...data });
    },
  };
  return <DynamicComponent {...widget} instance={_instance} />;
};

export default WidgetCustom;
