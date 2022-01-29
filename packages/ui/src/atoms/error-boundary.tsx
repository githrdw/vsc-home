import React from 'react';
import IconBug from '../assets/img/icon-bug.svg';
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
        <div>
          <h1>Something went wrong.</h1>
          <img src={IconBug} />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
