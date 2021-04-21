import { Container } from '@chakra-ui/react';
import React from 'react';

export interface PageProps {
    Header?: () => JSX.Element;
}

export const Page: React.FC<PageProps> = ({ children, Header }) => {
    return (
        <>
            {Header && <Header />}
            <Container maxW="container.xl" mb={12}>
                {children}
            </Container>
        </>
    );
};

export default Page;
