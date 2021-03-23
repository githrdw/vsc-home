import {
  Button,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  useTheme,
} from '@chakra-ui/react';
import React from 'react';

const ColorPopover = ({ open, close, children, onColor }: any) => {
  const theme = useTheme();
  const colors = [
    'black.2',
    'white.2',
    'red.2',
    'green.2',
    'blue.2',
    'gray.2',
    'yellow.2',
    'orange.2',
    'purple.2',
    'pink.2',
    'teal.2',
    'transparent',
  ].map(name => {
    const [color, alpha] = name.split('.');
    const chakraColor = theme.colors[color];
    const hexAlpha = Math.round((Number(alpha) / 10) * 255)
      .toString(16)
      .padStart(2, '0');
    if (typeof chakraColor !== 'string') {
      return chakraColor[500] + hexAlpha;
    } else if (chakraColor.includes('#') && alpha !== undefined) {
      return chakraColor + hexAlpha;
    } else {
      return color;
    }
  });
  return (
    <Popover
      isOpen={open}
      returnFocusOnClose={false}
      onClose={close}
      placement="bottom"
    >
      <PopoverTrigger {...{ children }} />

      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <SimpleGrid columns={5} spacing={2} p={2}>
            {colors.map((c: any) => (
              <Button
                key={c}
                aria-label={c}
                background={c}
                borderColor="black"
                borderWidth={c === 'transparent' ? 1 : 0}
                height="22px"
                width="22px"
                padding={0}
                minWidth="unset"
                borderRadius={3}
                _hover={{ background: c }}
                onClick={() => {
                  onColor(c);
                }}
              ></Button>
            ))}
          </SimpleGrid>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default ColorPopover;
