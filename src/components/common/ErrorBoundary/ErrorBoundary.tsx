/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/destructuring-assignment */
import React, { ErrorInfo } from 'react';
import { Container, Heading, Text } from '@chakra-ui/react';
import bugsnag from 'utils/bugsnag';

const BugsnagErrorBoundary = bugsnag
    ?.getPlugin('react')
    ?.createErrorBoundary(React);

class AppErrorBoundary extends React.Component<
    {
        children: React.ReactNode;
        FallbackComponent: React.ElementType;
    },
    {
        error: Error | undefined;
        info: ErrorInfo | undefined;
    }
> {
    constructor(props) {
        super(props);
        this.state = { error: undefined, info: undefined };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        console.log({ error, errorInfo });
        this.state = { error, info: errorInfo };
    }

    render() {
        const { children, FallbackComponent } = this.props;

        if (this.state.error) {
            // You can render any custom fallback UI
            return <FallbackComponent {...this.state} />;
        }

        return children;
    }
}

export const ErrorBoundary = ({ children }) => {
    if (BugsnagErrorBoundary) {
        return (
            <BugsnagErrorBoundary FallbackComponent={ErrorView}>
                {children}
            </BugsnagErrorBoundary>
        );
    }

    return (
        <AppErrorBoundary FallbackComponent={ErrorView}>
            {children}
        </AppErrorBoundary>
    );
};

const ErrorView = () => {
    return (
        <Container p={12} maxW="container.lg">
            <Heading>An error occured rendering this page</Heading>
            <Text>We have been notified of the issue.</Text>
        </Container>
    );
};

export default ErrorBoundary;
