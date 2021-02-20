import React, { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { WidthProvider, Responsive } from 'react-grid-layout';

import { $ui } from '../../state';

import Widget from '../widget';

const GridLayout = WidthProvider(Responsive);

const grid = {
  cols: { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 30,
  compactType: null,
};

export const Grid = () => {
  const widgets = useRecoilValue($ui.widgets);
  const [layout, setLayout] = useRecoilState($ui.layout);

  const RenderedWidgets = useMemo(() => {
    const Children = [];
    for (const { id, ...props } of widgets) {
      Children.push(
        <div key={id}>
          <Widget {...props} />
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
