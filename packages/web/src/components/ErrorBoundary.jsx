import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) {
    // Optional: send to logging service
    console.error('ErrorBoundary', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="page error-block">
          <h1 className="page-title">Unexpected Error</h1>
            <p className="mt-4 text-sm">{this.state.error?.message || 'Something went wrong.'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
