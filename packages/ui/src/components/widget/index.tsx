import React, { Suspense, lazy, useMemo, useRef, useState } from 'react';

import { Box, Progress, useToken } from '@chakra-ui/react';

import Header from './header';
import { WidgetProps } from './types';
import Confirm from '@atoms/confirm';
import { useRecoilValue } from 'recoil';
import { $ui } from '@state';
import ErrorBoundary from '@atoms/error-boundary';

const Widget = ({
  onWidgetUpdate,
  onWidgetDelete,
  ...widgetMeta
}: WidgetProps) => {
  const { id, appearance, data, type } = widgetMeta;
  const { title, hideTitlebar, icon } = appearance;
  const [callbacks, setCallbacks] = useState<{ delete: any; menu: any }>();
  const [appearanceState, setAppearanceState] = useState(appearance);

  const editMode = useRecoilValue($ui.editMode);
  const [baseColor, alpha] = appearanceState.color.split('.');
  const confirm = useRef<() => Promise<() => void>>();

  const [chakraColor] = useToken('colors', [baseColor]);

  const updateAppearance = (key: keyof typeof appearance, value: any) => {
    if (appearanceState[key] !== value) {
      setAppearanceState({ ...appearanceState, [key]: value });
      onWidgetUpdate?.(
        {
          ...widgetMeta,
          appearance: { ...appearanceState, [key]: value },
        },
        true
      );
    }
  };

  const updateData = (newData: WidgetProps, skipStateUpdate: boolean) => {
    onWidgetUpdate?.(
      {
        ...widgetMeta,
        data: { ...data, ...newData },
      },
      skipStateUpdate
    );
    return { ...data, ...newData };
  };

  const deleteWidget = async () => {
    if (await confirm.current?.()) {
      callbacks?.delete?.();
      onWidgetDelete?.();
    }
  };

  const content = useMemo(() => {
    const getter = async () =>
      await import(/* webpackPreload: true */ `../widget-${type}`);
    const Component = lazy(() => getter());

    return (
      <Suspense fallback={<Progress size="xs" isIndeterminate />}>
        <Component {...{ id, setCallbacks, updateData, ...data }} />
      </Suspense>
    );
  }, [id, appearance, type === 'custom' ? undefined : data, type]);

  const alphaColor = useMemo(() => {
    const hexAlpha = Math.round((Number(alpha) / 10) * 255)
      .toString(16)
      .padStart(2, '0');

    if (typeof chakraColor !== 'string') {
      return chakraColor[500] + hexAlpha;
    } else if (chakraColor.includes('#') && alpha) {
      return chakraColor + hexAlpha;
    } else {
      return chakraColor;
    }
  }, [appearanceState]);

  return (
    <Box bg={alphaColor} height="100%" display="flex" flexDir="column">
      <Confirm ref={confirm} />
      {(!hideTitlebar || editMode) && (
        <Header
          {...{
            id,
            title,
            alphaColor,
            hideTitlebar,
            icon,
            updateIcon: icon => updateAppearance('icon', icon),
            updateColor: color => updateAppearance('color', color),
            toggleTitlebar: () =>
              updateAppearance('hideTitlebar', !appearance.hideTitlebar),
            updateName: ({ target: { innerText } }) =>
              updateAppearance('title', innerText),
            deleteWidget,
            callbacks,
          }}
        />
      )}
      <Box
        className="selection-allowed"
        px={2}
        py={2}
        borderRadius="sm"
        overflow="auto"
        flex="1"
      >
        <ErrorBoundary {...{ data, type }}>{content}</ErrorBoundary>
      </Box>
    </Box>
  );
};
export default Widget;
