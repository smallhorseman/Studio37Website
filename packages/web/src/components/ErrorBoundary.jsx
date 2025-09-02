import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(err, info) { /* optional log */ }
  render() {
    if (this.state.hasError) {
      return (
        <div className="page error-block">
          <h1 className="page-title">Something went wrong</h1>
          <p className="mt-4 text-sm">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
