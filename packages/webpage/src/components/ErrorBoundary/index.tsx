import React from 'react';

export interface IProps {
    onReset?: () => void;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    renderFallback: (reset: () => void, error?: Error) => JSX.Element;
    children: React.ReactNode;
}

interface IState {
    hasError?: boolean;
    error?: Error;
}

export default class ErrorBoundary extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { hasError: false };
    }

    resetErrorBoundary = () => {
        this.props.onReset?.();
        this.setState({ hasError: false });
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.props.onError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.renderFallback(this.resetErrorBoundary, this.state.error);
        }
        return this.props.children;
    }
}
