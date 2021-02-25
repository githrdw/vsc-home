import React, { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { WidthProvider, Responsive } from 'react-grid-layout';

import { $ui } from '../../state';

import Widget from '../widget';
import { WidgetProps } from '@components/widget/types';

const GridLayout = WidthProvider(Responsive);

const grid = {
  cols: { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 30,
  compactType: null,
};

export const Grid = () => {
  const [widgets, setWidgets] = useRecoilState($ui.widgets);
  const [layout, setLayout] = useRecoilState($ui.layout);

  const updateWidget = (props: WidgetProps) => {
    const widgetIndex = widgets.findIndex(({ id }) => id === props.id);
    const newWidgets: any = [...widgets];
    newWidgets[widgetIndex] = props;
    console.warn(widgets, newWidgets, props, setWidgets);
    setWidgets(newWidgets);
  };

  const RenderedWidgets = useMemo(() => {
    const Children = [];
    for (const { id, ...props } of widgets) {
      Children.push(
        <div key={id}>
          <Widget
            {...props}
            onWidgetUpdate={data => updateWidget({ id, ...data })}
          />
        </div>
      );
    }
    return Children;
  }, [widgets]);

  return (
    <GridLayout
      {...grid}
      layouts={layout}
      onLayoutChange={(l, layouts: any) => setLayout(layouts)}
      measureBeforeMount
    >
      {RenderedWidgets}
    </GridLayout>
  );
};

export default Grid;
