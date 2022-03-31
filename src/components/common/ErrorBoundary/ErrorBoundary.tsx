import React from 'react';
import Bugsnag from '@bugsnag/js';
import { Container, Heading, Text } from '@chakra-ui/react';
import 'utils/bugsnag';

const BugsnagErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);

export const ErrorBoundary: React.FC = ({ children }) => {
    return (
        <BugsnagErrorBoundary FallbackComponent={ErrorView}>
            {children}
        </BugsnagErrorBoundary>
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
