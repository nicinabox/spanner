---
to: pages/<%= route %>.tsx
---
import React from 'react';
import Link from 'next/link';
import { Container } from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';

export interface <%=name %>PageProps {
    params: {

    }
}

const PageHeader = () => {
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
    const { data } = useRequest();

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
