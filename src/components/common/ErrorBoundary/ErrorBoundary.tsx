import React from 'react';
import { Container, Heading, Text } from '@chakra-ui/react';
import bugsnag from 'utils/bugsnag';

const BugsnagErrorBoundary = bugsnag
    ?.getPlugin('react')
    ?.createErrorBoundary(React);

export const ErrorBoundary = ({ children }) => {
    if (BugsnagErrorBoundary) {
        return (
            <BugsnagErrorBoundary FallbackComponent={ErrorView}>
                {children}
            </BugsnagErrorBoundary>
        );
    }

    return children;
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
