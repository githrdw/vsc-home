import React, { useMemo, useRef, useState } from 'react';
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
  style: {
    height: '100%',
  },
};

const DefaultDropItem = {
  i: 'DROP',
  w: 2,
  h: 2,
  _unset: true,
};

export const Grid = () => {
  const [widgets, setWidgets] = useRecoilState($ui.widgets);
  const [layout, setLayout] = useRecoilState($ui.layout);
  const [droppingItem, setDroppingItem] = useState(DefaultDropItem);
  const preventLayoutChange = useRef(true);

  const addWidget = (props: WidgetProps) => {
    const id = (
      Math.max(...widgets.map(({ id }) => parseInt(id)), 0) + 1
    ).toString();
    const newWidgets: any = [...widgets];
    if (props.layout && props.x !== undefined && props.y !== undefined) {
      const { x, y } = props;
      for (const size in props.layout) {
        const layout = props.layout[size];
        props.layout[size] = { x, y, minW: 2, minH: 2, ...layout };
      }
      delete props.x;
      delete props.y;
    }
    newWidgets.push({ ...props, id });
    console.warn('ADD', { props, widgets, newWidgets });
    setWidgets(newWidgets);
  };

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
      droppingItem={droppingItem}
      onLayoutChange={(l, layouts: any) => {
        if (preventLayoutChange.current)
          return (preventLayoutChange.current = false);
        setLayout(layouts);
      }}
      measureBeforeMount
      isDroppable={true}
      onDrag={(layout, oldItem, newItem, placeholder, e: any) => {
        if (!e?.dataTransfer?.items) return;
        preventLayoutChange.current = true;
        const dl: { type: string }[] = Array.from(e.dataTransfer.items);
        const meta = dl.find(({ type }: any) => type.match(/^vsch\/widget/gm));
        if (meta && droppingItem._unset) {
          console.warn({ meta });
          setDroppingItem({
            i: 'DROP',
            w: 6,
            h: 2,
            _unset: false,
          });
        } else setDroppingItem(DefaultDropItem);
      }}
      onDrop={(layout, item, e: any) => {
        preventLayoutChange.current = true;
        e.preventDefault();
        // Get the data, which is the id of the drop target
        const [_data] = e.dataTransfer.items;
        _data.getAsString((data: string) => {
          if (data && layout && item) {
            const jsonData = JSON.parse(data);
            const { x, y } = item;
            addWidget({ x, y, ...jsonData });
          }
        });
      }}
    >
      {RenderedWidgets}
    </GridLayout>
  );
};

export default Grid;
