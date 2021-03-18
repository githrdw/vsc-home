import React, {
  Suspense,
  lazy,
  useMemo,
  FocusEvent,
  useRef,
  useState,
} from 'react';

import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Progress,
  Spacer,
  useToken,
} from '@chakra-ui/react';
import { HamburgerIcon, DeleteIcon, StarIcon } from '@chakra-ui/icons';

import IconPlaceholder from './icon-placeholder';
import { WidgetProps } from './types';
import Confirm from '@atoms/confirm';

const Widget = ({
  onWidgetUpdate,
  onWidgetDelete,
  ...widgetMeta
}: WidgetProps) => {
  const { id, appearance, data, type } = widgetMeta;
  const { title, color } = appearance;
  const [callbacks, setCallbacks] = useState<{ delete: any }>();
  const [baseColor, alpha] = color.split('.');
  const confirm = useRef<() => Promise<() => void>>();

  const [chakraColor] = useToken('colors', [baseColor]);

  const updateName = ({ target: { innerText } }: FocusEvent<HTMLElement>) => {
    if (innerText !== title)
      onWidgetUpdate?.({
        ...widgetMeta,
        appearance: { title: innerText, color },
      });
  };

  const deleteWidget = async () => {
    if (await confirm.current?.()) {
      callbacks?.delete();
      onWidgetDelete?.();
    }
  };

  const content = useMemo(() => {
    const getter = async () =>
      await import(/* webpackPreload: true */ `../widget-${type}`);
    const widgetContent = getter();
    const Component = lazy(() => widgetContent);

    return (
      <Suspense fallback={<Progress size="xs" isIndeterminate />}>
        <Component {...{ id, setCallbacks, ...data }} />
      </Suspense>
    );
  }, [type, data]);

  const alphaColor = useMemo(() => {
    const hexAlpha = Math.round((Number(alpha) / 10) * 255)
      .toString(16)
      .padStart(2, '0');

    if (typeof chakraColor !== 'string') {
      return chakraColor[500] + hexAlpha;
    } else if (chakraColor.includes('#')) {
      return chakraColor + hexAlpha;
    } else {
      return chakraColor;
    }
  }, [color]);

  return (
    <Box bg={alphaColor} height="100%">
      <Confirm ref={confirm} />
      <Flex p={2} fontSize="lg" align="center">
        <IconPlaceholder bg={alphaColor}>
          <StarIcon w={5} h={4} />
        </IconPlaceholder>
        <Heading
          size="sm"
          w="calc(100% - 3.7rem)"
          m={0}
          ml="3.5rem"
          p=".6rem"
          position="absolute"
          left={0}
          whiteSpace="nowrap"
          overflow="hidden"
          suppressContentEditableWarning={true}
          onBlur={updateName}
          contentEditable
        >
          {title}
        </Heading>
        <Spacer />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            size="xs"
            variant="outline"
          />
          <Portal>
            <MenuList>
              <MenuItem onClick={deleteWidget} icon={<DeleteIcon />}>
                Delete
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
      <Divider m={0} mt="-1px" />
      <Box
        className="selection-allowed"
        px={2}
        py={3}
        borderRadius="sm"
        overflow="auto"
        height="calc(100% - 34px)"
      >
        {content}
        {/* <Input /> */}
      </Box>
    </Box>
  );
};
export default Widget;
