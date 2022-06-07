import React, { useMemo, useRef, useState, useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { WidthProvider, Responsive } from 'react-grid-layout';

import { $ui } from '../../state';

import Widget from '../widget';
import { WidgetProps } from '@components/widget/types';
import EventBus from '@hooks/event-bus';

const GridLayout = WidthProvider(Responsive);
const uid = (window as any).VSCH_UID || 'default';

const grid = {
  cols: { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 30,
  compactType: null,
  preventCollision: true,
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
  const editMode = useRecoilValue($ui.editMode);
  const [droppingItem, setDroppingItem] = useState(DefaultDropItem);
  const preventLayoutChange = useRef(true);
  const Bus = useContext(EventBus);

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
    setWidgets(newWidgets);
  };

  const deleteWidget = (id: string) => {
    const widgetIndex = widgets.findIndex(({ id: _id }) => _id === id);
    const newWidgets: any = [...widgets];
    newWidgets.splice(widgetIndex, 1);
    setWidgets(newWidgets);
  };
  const updateWidget = (props: WidgetProps, skipStateUpdate?: boolean) => {
    const widgetIndex = widgets.findIndex(({ id }) => id === props.id);
    const newWidgets: any = [...widgets];
    newWidgets[widgetIndex] = props;
    if (skipStateUpdate) {
      Bus.emit('vsch.ui.setLayout', {
        uid,
        layout: newWidgets,
      });
    } else {
      setWidgets(newWidgets);
    }
  };

  const RenderedWidgets = useMemo(() => {
    const Children = [];
    for (const props of widgets) {
      Children.push(
        <div key={props.id}>
          <Widget
            {...props}
            onWidgetUpdate={(data: any, skipStateUpdate) =>
              updateWidget({ id: props.id, ...data }, skipStateUpdate)
            }
            onWidgetDelete={() => deleteWidget(props.id)}
          />
        </div>
      );
    }
    return Children;
  }, [widgets, editMode]);

  return (
    <GridLayout
      {...grid}
      isDraggable={editMode}
      isResizable={editMode}
      layouts={layout}
      droppingItem={droppingItem}
      onLayoutChange={(l, layouts: any) => {
        if (preventLayoutChange.current) {
          return (preventLayoutChange.current = false);
        }
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
