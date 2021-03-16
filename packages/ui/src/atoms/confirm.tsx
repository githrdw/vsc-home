import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

const Confirm = ({ item = 'item' }, ref: React.Ref<unknown>) => {
  const [isOpen, setIsOpen] = useState(false);

  const cancelRef = useRef(null);
  const resolveRef = useRef<Function>();

  const confirm = () => {
    resolveRef.current?.(true);
    setIsOpen(false);
  };
  const reject = () => {
    resolveRef.current?.(false);
    setIsOpen(false);
  };

  useImperativeHandle(ref, () => () => {
    return new Promise(resolve => {
      setIsOpen(true);
      resolveRef.current = resolve;
    });
  });

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={reject}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete {item}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can&apos;t undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={reject}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirm} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const ConfirmInstance = forwardRef(Confirm);

export default ConfirmInstance;
