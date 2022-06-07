import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import EventBus, { EventBusInstance } from './hooks/event-bus';
import { RecoilRoot } from 'recoil';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { setNonce } from 'get-nonce';

import theme from './theme';
import Dashboard from '@components/dashboard';

const nonce = (window as any).getOneTimeNonce();
setNonce(nonce);

const Application = () => {
  return (
    <>
      <CacheProvider
        value={createCache({
          key: 'contentsecuritypolicy',
          nonce,
        })}
      >
        <ChakraProvider theme={theme} resetCSS={false}>
          <RecoilRoot>
            <EventBus.Provider value={EventBusInstance}>
              <Dashboard />
            </EventBus.Provider>
          </RecoilRoot>
        </ChakraProvider>
      </CacheProvider>
    </>
  );
};

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);
root.render(<Application />);
