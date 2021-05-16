import {
    Badge, Box, Container, ContainerProps, SimpleGrid, Spacer, Tabs,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

export interface PageProps extends ContainerProps {
    Header?: JSX.Element;
}

export const Page: React.FC<PageProps> = ({ children, Header, ...containerProps }) => {
    const router = useRouter();

    return (
        <Tabs colorScheme="brandInverted" size="sm" variant="soft-rounded" isLazy defaultIndex={Number(router.query.panelId) || 0}>
            <SimpleGrid templateRows="auto 1fr auto" minH="100vh">
                {Header}

                <Container maxW="none" mb={12} {...containerProps}>
                    {children}
                </Container>

                <Box alignItems="center" display="flex" p={4}>
                    <Badge colorScheme="gray" textTransform="none">v3-next</Badge>
                </Box>
            </SimpleGrid>
        </Tabs>
    );
};

export default Page;
