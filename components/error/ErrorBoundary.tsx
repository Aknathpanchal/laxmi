'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, Wifi, WifiOff } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'critical';
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimer: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Report error to monitoring service
    this.reportError(error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, send to error monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    // Mock error reporting
    console.log('Error reported:', errorReport);
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;

    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));

      // Auto-retry with exponential backoff for component level errors
      if (this.props.level === 'component') {
        const delay = Math.pow(2, this.state.retryCount) * 1000; // 1s, 2s, 4s...
        this.retryTimer = setTimeout(() => {
          this.forceUpdate();
        }, delay);
      }
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        retryCount={this.state.retryCount}
        maxRetries={this.props.maxRetries || 3}
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
        onReload={this.handleReload}
        showDetails={this.props.showDetails}
        level={this.props.level || 'component'}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onGoHome: () => void;
  onReload: () => void;
  showDetails?: boolean;
  level: 'page' | 'component' | 'critical';
}

function ErrorFallback({
  error,
  errorInfo,
  errorId,
  retryCount,
  maxRetries,
  onRetry,
  onGoHome,
  onReload,
  showDetails = false,
  level
}: ErrorFallbackProps) {
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getErrorTitle = () => {
    if (!isOnline) return 'Connection Lost';

    switch (level) {
      case 'critical':
        return 'Critical System Error';
      case 'page':
        return 'Page Error';
      case 'component':
        return 'Component Error';
      default:
        return 'Something Went Wrong';
    }
  };

  const getErrorMessage = () => {
    if (!isOnline) {
      return 'Please check your internet connection and try again.';
    }

    switch (level) {
      case 'critical':
        return 'A critical error has occurred. Please contact support if this continues.';
      case 'page':
        return 'This page encountered an error. Try refreshing or go back to the home page.';
      case 'component':
        return 'This section is temporarily unavailable. We\'re working to fix it.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const containerClass = level === 'component'
    ? 'p-6 bg-slate-800/50 rounded-lg border border-red-500/20'
    : 'min-h-screen bg-slate-900 flex items-center justify-center p-6';

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center"
        >
          {!isOnline ? (
            <WifiOff className="w-8 h-8 text-red-500" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-red-500" />
          )}
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-2">
          {getErrorTitle()}
        </h1>

        <p className="text-slate-400 mb-6">
          {getErrorMessage()}
        </p>

        {errorId && (
          <p className="text-xs text-slate-500 mb-4 font-mono">
            Error ID: {errorId}
          </p>
        )}

        {/* Connection Status */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
            {isOnline ? 'Connected' : 'Offline'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {retryCount < maxRetries && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}</span>
            </motion.button>
          )}

          {level !== 'component' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReload}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGoHome}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </motion.button>
            </>
          )}
        </div>

        {/* Error Details Toggle */}
        {(showDetails || process.env.NODE_ENV === 'development') && error && (
          <div className="mt-6">
            <button
              onClick={() => setDetailsVisible(!detailsVisible)}
              className="flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-400 transition-colors mx-auto"
            >
              <Bug className="w-4 h-4" />
              <span>{detailsVisible ? 'Hide' : 'Show'} Error Details</span>
            </button>

            {detailsVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-slate-800 rounded-lg text-left overflow-hidden"
              >
                <h4 className="text-sm font-semibold text-red-400 mb-2">Error Details:</h4>
                <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {error.message}
                </pre>
                {error.stack && (
                  <>
                    <h4 className="text-sm font-semibold text-red-400 mt-3 mb-2">Stack Trace:</h4>
                    <pre className="text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </>
                )}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Specialized error boundaries for different contexts
export function DashboardErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      level="page"
      maxRetries={2}
      showDetails={false}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      level="component"
      maxRetries={3}
      showDetails={false}
    >
      {children}
    </ErrorBoundary>
  );
}

export function CriticalErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      level="critical"
      maxRetries={1}
      showDetails={true}
    >
      {children}
    </ErrorBoundary>
  );
}