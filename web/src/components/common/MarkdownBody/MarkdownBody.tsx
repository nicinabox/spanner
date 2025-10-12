import { Box } from '@chakra-ui/react';
import { marked } from 'marked';
import Head from 'next/head';
import React from 'react';

export interface MarkdownBodyProps {
    body: string;
}

// @ts-expect-error multiple renders
const renderer: marked.Renderer = {
    table(header, body) {
        return `
        <div style="overflow-x: auto;">
            <table style="width: 100%;">
                ${header}
                ${body}
            </table>
        </div>
        `;
    },
};

marked.use({ renderer });

const styles = {
    '&': {
        backgroundColor: 'transparent',
    },
    '& a': {
        color: 'brand.primary',
        textDecoration: 'underline',
    },
    '& table tr': {
        backgroundColor: 'transparent',
    },
    '& table tr:nth-of-type(2n), & thead': {
        backgroundColor: 'brand.100',
    },
    '.chakra-ui-dark &': {
        color: 'white',
    },
    '.chakra-ui-dark & a': {
        color: 'brandInverted.primary',
        textDecoration: 'underline',
    },
    '.chakra-ui-dark & tr:nth-of-type(2n), .chakra-ui-dark & thead': {
        backgroundColor: 'gray.800',
    },
};

export const MarkdownBody: React.FC<MarkdownBodyProps> = ({ body }) => {
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown.min.css"
                    integrity="sha512-BrOPA520KmDMqieeM7XFe6a3u3Sb3F1JBaQnrIAmWg3EYrciJ+Qqe6ZcKCdfPv26rGcgTrJnZ/IdQEct8h3Zhw=="
                    crossOrigin="anonymous"
                />
            </Head>
            <Box
                className="markdown-body"
                sx={styles}
                fontFamily="inherit"
                dangerouslySetInnerHTML={{ __html: marked(body) }}
            />
        </>
    );
};

export default MarkdownBody;
