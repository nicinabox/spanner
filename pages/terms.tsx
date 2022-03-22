import React from 'react';
import { Container } from '@chakra-ui/react';
import { getHtmlFromMarkdown } from '../src/utils/getContentFile';

const Terms = ({ html }) => {
    return (
        <Container maxW="container.md">
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </Container>
    );
};

export async function getStaticProps() {
    const html = getHtmlFromMarkdown('terms.md');

    return {
        props: {
            html,
        },
    };
}

export default Terms;
