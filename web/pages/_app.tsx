import React from 'react';
import Head from 'next/head';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Lato } from 'next/font/google';
import theme from 'theme';
import ErrorBoundary from 'components/common/ErrorBoundary';

const lato = Lato({
    weight: ['300', '400', '700', '900'],
    subsets: ['latin'],
    display: 'swap',
});

function App({ Component, pageProps }) {
    return (
        <div className={lato.className}>
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
                    />
                </Head>

                <CSSReset />

                <ErrorBoundary>
                    <Component {...pageProps} />
                </ErrorBoundary>
            </ChakraProvider>
        </div>
    );
}

export default App;
