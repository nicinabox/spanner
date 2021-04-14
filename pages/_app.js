import { ThemeProvider, CSSReset, theme } from '@chakra-ui/react';

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <CSSReset />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp
