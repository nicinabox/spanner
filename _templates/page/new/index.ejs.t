---
to: pages/<%= route %>.tsx
---
import React from 'react';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import Page from 'components/Page';
import Header from 'components/Header';

export interface <%=name %>PageProps {
}

export const <%=name %>Page: React.FC<<%=name %>PageProps> = ({ params, ...props }) => {
    return (
        <Page
            Header={<Header />}
        >
           <Container>
                TODO
           </Container>
        </Page>
    );
};

export default <%=name %>Page;

// TODO: Export getServerSideProps
