'use client';

import { ReactNode, ErrorInfo, Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
          <Card className="w-full max-w-md border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <CardTitle className="text-red-900 dark:text-red-100">
                  Something went wrong
                </CardTitle>
              </div>
              <CardDescription className="text-red-800 dark:text-red-200">
                We encountered an unexpected error. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-white dark:bg-slate-900 p-3 overflow-auto max-h-32">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  {this.state.error.message}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={this.resetError}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="flex-1"
                >
                  Go home
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <details className="text-xs text-slate-600 dark:text-slate-400">
                  <summary className="cursor-pointer font-semibold">Stack trace</summary>
                  <pre className="mt-2 p-2 bg-white dark:bg-slate-900 rounded overflow-auto max-h-40 whitespace-pre-wrap break-words">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components (if needed in future)
export function useErrorHandler(error: Error | null) {
  if (error) {
    throw error;
  }
}
