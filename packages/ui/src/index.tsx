import React from 'react';
import { hydrate, render } from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';

import theme from './theme';
import Dashboard from './components/dashboard';

const Application = () => {
  return (
    <>
      <ChakraProvider theme={theme} resetCSS={false}>
        <RecoilRoot>
          <Dashboard />
        </RecoilRoot>
      </ChakraProvider>
    </>
  );
};

const rootElement = document.getElementById('app');
if (rootElement?.hasChildNodes()) {
  hydrate(<Application />, rootElement);
} else {
  render(<Application />, rootElement);
}
