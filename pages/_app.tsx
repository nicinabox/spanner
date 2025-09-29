import React from 'react';
import Head from 'next/head';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import theme from 'theme';
import ErrorBoundary from 'components/common/ErrorBoundary';

function App({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <Head>
                <title>Spanner</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta
                    name="description"
                    content="The easiest way keep service records for all your vehicles."
                />
                {}
                <meta
                    name="theme-color"
                    content={theme.colors.brand.primary}
                    media="(prefers-color-scheme: light)"
                />
                <meta
                    name="theme-color"
                    content={theme.colors.brand['600']}
                    media="(prefers-color-scheme: dark)"
                />
            </Head>

            <CSSReset />

            <ErrorBoundary>
                <Component {...pageProps} />
            </ErrorBoundary>
        </ChakraProvider>
    );
}

export default App;
