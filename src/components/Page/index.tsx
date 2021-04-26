import { Container, ContainerProps } from '@chakra-ui/react';
import React from 'react';

export interface PageProps extends ContainerProps {
    Header?: JSX.Element;
}

export const Page: React.FC<PageProps> = ({ children, Header, ...containerProps }) => {
    return (
        <>
            {Header}
            <Container maxW="none" mb={12} {...containerProps}>
                {children}
            </Container>
        </>
    );
};

export default Page;
