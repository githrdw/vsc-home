import { Box, Button, Center, Heading, ButtonGroup } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import EventBus from '@hooks/event-bus';

import React, { useContext } from 'react';
const PROVIDERS: any = {
  GITHUB: 'GitHub',
  BITBUCKET: 'Bitbucket',
  GITLAB: 'GitLab',
};

export default function Login({
  setProviderHash,
}: {
  setProviderHash: (hash: string) => void;
}) {
  const Bus = useContext(EventBus);
  const requestAuth = async (providerKey: string) => {
    const { providerHash } = await Bus.emit('vsch.ui.requestAuthentication', {
      providerKey,
      _node: 'Remote repositories',
    });
    if (providerHash) {
      setProviderHash(providerHash);
    }
  };

  const ProviderButtons = () => {
    return (
      <>
        {Object.keys(PROVIDERS).map(key => (
          <Button
            key={key}
            width="full"
            my={1}
            onClick={() => requestAuth(key)}
            rightIcon={<ArrowForwardIcon />}
          >
            {PROVIDERS[key]}
          </Button>
        ))}
      </>
    );
  };

  return (
    <Center h="100%" flexDirection="column">
      <Heading size="lg" textAlign="center">
        Continue with...
      </Heading>
      <Box>
        <ButtonGroup display="block" mt={3} spacing={0}>
          <ProviderButtons />
        </ButtonGroup>
      </Box>
    </Center>
  );
}
