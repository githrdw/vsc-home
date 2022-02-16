import React from 'react';

import './style.scss';

import IconBug from '@assets/img/icon-bug.svg';
import {
  Box,
  Button,
  Code,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import EventBus, { EventBusInstance } from '@hooks/event-bus';

interface IErrorBoundary {
  hasError: boolean;
  showDebug: boolean;
  widgetName?: string;
  errorInfo?: Error;
  error: { name: string; message: string };
}

class ErrorBoundary extends React.Component<
  { data: any; type?: string },
  IErrorBoundary
> {
  state = {
    hasError: false,
    showDebug: false,
    widgetName: 'Websockets',
    errorInfo: undefined,
    error: { name: '', message: '' },
  };
  static contextType = EventBus;
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.name && error.message) {
      console.log(this.props);
      const widgetName =
        this.props.type === 'custom'
          ? this.props.data.widget.title
          : this.props.type;
      this.setState({
        widgetName,
        error: { name: error.name, message: error.message },
        errorInfo: error,
      });
    }
    console.log({ error }, errorInfo);
  }
  debugClose() {
    this.setState({ showDebug: false });
  }
  debugOpen() {
    this.setState({ showDebug: true });
  }
  showErrorConsole() {
    const Bus: typeof EventBusInstance = this.context;
    Bus.emit('workbench.openDevtools', {});
    setTimeout(() => {
      console.clear();
      console.log('\n'.repeat(25));
      console.log(
        'The following error occured attempting to load ' +
          this.state.widgetName
      );
      console.error(this.state.errorInfo);
    }, 100);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <Modal
            size="3xl"
            isOpen={this.state.showDebug}
            onClose={() => this.debugClose()}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Widget debug information</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                The following error occured attempting to load{' '}
                <Code>{this.state.widgetName}</Code>
                <Box
                  borderRadius="md"
                  bg="#250201"
                  p={4}
                  mt={4}
                  fontFamily="mono"
                >
                  {this.state.error.name}: {this.state.error.message}
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button
                  rightIcon={<ChevronRightIcon />}
                  onClick={() => this.showErrorConsole()}
                >
                  View in Devtools
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <img
            className="error-boundary__bug"
            src={IconBug}
            height="64px"
            width="64px"
          />
          <h1>You just met a bug</h1>
          <Button
            size="sm"
            rightIcon={<ChevronRightIcon />}
            onClick={() => this.debugOpen()}
          >
            Debug
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
