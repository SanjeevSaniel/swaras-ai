'use client';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-red-600 mb-4'>
              Something went wrong
            </h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className='px-4 py-2 bg-blue-500 text-white rounded-lg'>
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
