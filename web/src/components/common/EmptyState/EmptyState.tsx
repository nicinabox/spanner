import {
    Box, Center, Flex, Heading, LightMode, Text,
} from '@chakra-ui/react';
import React from 'react';

export interface EmptyStateProps {
    heading: string;
    details?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ heading, details, action }) => {
    return (
        <Center>
            <Flex py={10} px={[null, 12]} my={8} flexDirection="column" align="center">
                <Heading textAlign="center" size="lg" mb={2}>
                    {heading}
                </Heading>
                <Text textAlign="center" fontSize="lg">{details}</Text>

                {action && (
                    <Box mt={6}>
                        <LightMode>
                            {action}
                        </LightMode>
                    </Box>
                )}
            </Flex>
        </Center>
    );
};

export default EmptyState;
