import { Container, ContainerProps, Tabs } from '@chakra-ui/react';
import React from 'react';

export interface PageProps extends ContainerProps {
    Header?: JSX.Element;
}

export const Page: React.FC<PageProps> = ({ children, Header, ...containerProps }) => (
    <Tabs colorScheme="brandInverted" size="sm" variant="soft-rounded" isLazy>
        {Header}
        <Container maxW="none" mb={12} {...containerProps}>
            {children}
        </Container>
    </Tabs>
);

export default Page;
