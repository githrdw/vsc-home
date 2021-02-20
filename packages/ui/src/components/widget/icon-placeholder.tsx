import { Box } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

const IconPlaceholder: FC<{ children: ReactNode; bg: string }> = ({
  children,
  bg,
}) => (
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
    {children}
  </Box>
);

export default IconPlaceholder;
