---
to: pages/<%= route %>.tsx
---
import React from 'react';
import Link from 'next/link';
import { Container } from '@chakra-ui/react';
import Page from 'components/Page';
import Header from 'components/Header';
import BackButton from 'components/BackButton';

export interface <%=name %>PageProps {
    params: {

    }
}

const PageHeader = ({ vehicle }) => {
    return (
        <Header
            LeftComponent={(
                <HStack spacing={2}>
                    <BackButton>
                        Back
                    </BackButton>
                </HStack>
            )}
        />
    );
};

export const <%=name %>Page: React.FC<<%=name %>PageProps> = ({ params, ...props }) => {
    return (
        <Page
            Header={<PageHeader />}
        >
           <Container>
                TODO
           </Container>
        </Page>
    );
};

export default <%=name %>Page;

// TODO: Export getServerSideProps
