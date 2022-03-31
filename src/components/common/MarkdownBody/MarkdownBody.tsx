import { Box } from '@chakra-ui/react';
import { marked } from 'marked';
import Head from 'next/head';
import React from 'react';

export interface MarkdownBodyProps {
    body: string;
}

const styles = {
    '.chakra-ui-dark &': {
        color: 'white',
    },
    '.chakra-ui-dark & tr': {
        backgroundColor: 'gray.800',
    },
    '.chakra-ui-dark & tr:nth-of-type(2n)': {
        backgroundColor: 'gray.700',
    },
};

export const MarkdownBody: React.FC<MarkdownBodyProps> = ({ body }) => (
    <>
        <Head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css" integrity="sha512-Oy18vBnbSJkXTndr2n6lDMO5NN31UljR8e/ICzVPrGpSud4Gkckb8yUpqhKuUNoE+o9gAb4O/rAxxw1ojyUVzg==" crossOrigin="anonymous" />
        </Head>
        <Box className="markdown-body" sx={styles} fontFamily="inherit" dangerouslySetInnerHTML={{ __html: marked(body) }} />
    </>
);

export default MarkdownBody;
