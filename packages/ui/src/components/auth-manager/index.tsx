import React, { useContext, useEffect, useMemo, useState } from 'react';
import EventBus from '@hooks/event-bus';

import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
} from '@chakra-ui/react';
import { ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons';

const Credentials = ({
  isOpen,
  onClose,
  authPromise,
}: {
  isOpen: boolean;
  onClose: () => void;
  authPromise: any;
}) => {
  const Bus = useContext(EventBus);
  const [accounts, setAccounts] = useState([]);
  const [providerPending, setProviderPending] = useState(false);

  const getAccounts = async () => {
    const accounts = await Bus.emit('auth.getProviderAccounts', {
      providerKey: authPromise.providerKey,
    });
    if (accounts && accounts.map) setAccounts(accounts);
  };

  useEffect(() => {
    if (isOpen) getAccounts();
  }, [isOpen]);

  const deny = () => {
    authPromise.resolve(false);
    onClose();
  };

  const confirm = (providerHash: string) => {
    authPromise.resolve({ providerHash });
    onClose();
  };

  const addProvider = async () => {
    setProviderPending(true);
    const { providerHash } = await Bus.emit('auth.addProvider', {
      providerKey: authPromise.providerKey,
    });
    setProviderPending(false);
    authPromise.resolve({ providerHash });
    onClose();
  };

  const remove = async (provider: string, providerHash: string) => {
    await Bus.emit('auth.removeProvider', {
      provider,
      providerHash,
    });
    if (isOpen) getAccounts();
  };

  const Buttons = useMemo(
    () =>
      accounts.map(({ accountName, providerHash }) => (
        <ButtonGroup key={providerHash} w="100%">
          <IconButton
            my={2}
            icon={<DeleteIcon />}
            onClick={() => remove(authPromise.providerKey, providerHash)}
            aria-label="Remove item"
          ></IconButton>
          <Button
            disabled={providerPending}
            width="full"
            onClick={() => confirm(providerHash)}
            rightIcon={<ArrowForwardIcon />}
            my={2}
          >
            {accountName}
          </Button>
        </ButtonGroup>
      )),
    [accounts, providerPending]
  );
  return (
    <Modal isOpen={isOpen} onClose={deny} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Authorization request</ModalHeader>
        <ModalCloseButton />
        {isOpen && (
          <ModalBody>
            Widget <Tag>{authPromise._node}</Tag> requested access to provider{' '}
            <Tag>{authPromise.providerKey}</Tag>. Select or add an account to
            continue. You can also deny this request.
          </ModalBody>
        )}

        <Box borderRadius="md" w="100%" p={6}>
          <ButtonGroup size="lg" display="block" spacing={0}>
            {Buttons}
            <Button
              isLoading={providerPending}
              loadingText="Follow steps in your browser"
              width="full"
              variant="ghost"
              onClick={addProvider}
              my={2}
            >
              Add new acccount
            </Button>
          </ButtonGroup>
        </Box>

        <ModalFooter>
          <Button colorScheme="red" onClick={deny}>
            Deny
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default Credentials;
