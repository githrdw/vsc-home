import { Box, Progress } from '@chakra-ui/react';
import React, { FC, lazy, Suspense } from 'react';
import { useMemo } from 'react';
import { ChakraIcon } from './types';

const IconPlaceholder: FC<{ bg: string; icon: ChakraIcon }> = ({
  bg,
  icon,
}) => {
  const IconComponent = useMemo(() => {
    const getter = async () => {
      const { [icon]: element } = await import(
        /* webpackPreload: true */ `@chakra-ui/icons`
      );
      if (element) return { default: element };
      else {
        const { StarIcon } = await import('@chakra-ui/icons');
        return { default: StarIcon };
      }
    };
    const Component = lazy(() => getter());

    return (
      <Suspense fallback={<Progress size="xs" isIndeterminate />}>
        <Component />
      </Suspense>
    );
  }, [icon]);

  return (
    <Box
      clipPath="polygon(0 0, 70% 0, 100% 100%, 0% 100%)"
      background={bg}
      width="3.5rem"
      height="2.5rem"
      display="flex"
      alignItems="center"
      justifyContent="center"
      pr=".5rem"
      mt={-2}
      ml={-2}
      mb={-2}
      mr={2}
    >
      {IconComponent}
    </Box>
  );
};

export default IconPlaceholder;
