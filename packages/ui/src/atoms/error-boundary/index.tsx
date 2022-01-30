import React from 'react';

import './style.scss';

import IconBug from '@assets/img/icon-bug.svg';
import { Button } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError(/*error*/) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <img
            className="error-boundary__bug"
            src={IconBug}
            height="64px"
            width="64px"
          />
          <h1>You just met a bug</h1>
          <Button size="sm" rightIcon={<ChevronRightIcon />}>
            Debug
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
