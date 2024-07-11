import {
  Button,
  ButtonGroup,
  Flex,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import React, { createElement, FormEvent, useEffect, useState } from 'react';
import { VscGlobe, VscZoomIn } from 'react-icons/vsc';

interface IWidgetIframeProps {
  id: string;
  src: string;
  zoomLevel: number | string;
  setCallbacks?: (callbacks: any) => void;
  updateData?: (newData: any, skipStateUpdate?: boolean) => void;
}

const WidgetCollection = ({
  src,
  zoomLevel: _zoomLevel = 1,
  updateData,
  setCallbacks,
}: IWidgetIframeProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [srcInput, setSrcInput] = useState('');
  const [zoomLevel, setZoomLevel] = useState(
    typeof _zoomLevel === 'number' ? _zoomLevel : parseFloat(_zoomLevel)
  );

  const handleSrcUpdateClick = () => {
    updateData?.({ src: srcInput });
    onClose();
  };

  const handleSrcUpdateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateData?.({ src: srcInput });
    onClose();
  };

  const handleZoomLevel = (increment: number) => {
    setZoomLevel(level => level + increment);
  };

  useEffect(() => {
    updateData?.({ zoomLevel: zoomLevel.toFixed(1) });
  }, [zoomLevel]);

  if (setCallbacks) {
    setCallbacks({
      menu: {
        prepend: createElement(() => (
          <>
            <Flex py=".4rem" px=".8rem" fontSize="13.333px">
              <Flex as="span" pe=".75rem" alignItems="center">
                <VscZoomIn />
              </Flex>
              Zoom
              <Spacer />
              <ButtonGroup size="xs" isAttached variant="outline">
                <Button onClick={() => handleZoomLevel?.(-0.1)}>-</Button>
                <Button onClick={() => handleZoomLevel?.(+0.1)}>+</Button>
              </ButtonGroup>
            </Flex>
            <MenuItem icon={<VscGlobe />} onClick={onOpen}>
              Set iframe url
            </MenuItem>
          </>
        )),
      },
    });
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter iframe url</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSrcUpdateSubmit}>
              <Input
                value={srcInput}
                onChange={({ target }) => setSrcInput(target.value)}
                placeholder="https://"
              />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSrcUpdateClick}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {src ? (
        <iframe
          src={src}
          style={{
            position: 'absolute',
            top: '36px',
            left: 0,
            right: 0,
            zIndex: 0,
            width: `${(1 / zoomLevel) * 100}%`,
            height: `calc(${(1 / zoomLevel) * 100}% - ${
              (1 / zoomLevel) * 36
            }px)`,
            backfaceVisibility: 'hidden',
            transform: `scale(${zoomLevel}) translateZ(0)`,
            transformOrigin: '0 0',
            fontSmooth: 'subpixel-antialiased',
            perspective: '1px',
          }}
        />
      ) : (
        <Button onClick={onOpen}>Set iframe source</Button>
      )}
    </>
  );
};

export default WidgetCollection;
