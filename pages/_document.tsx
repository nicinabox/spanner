import React from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, {
    Html, Head, Main, NextScript,
} from 'next/document';
import theme from 'theme';
import Script from 'components/common/Script';

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en">
                <Head />
                <body>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    <Main />
                    <NextScript />

                    <Script>
                        {`
                        var _gauges = _gauges || [];
                        (function() {
                            var t   = document.createElement('script');
                            t.type  = 'text/javascript';
                            t.async = true;
                            t.id    = 'gauges-tracker';
                            t.setAttribute('data-site-id', '547f8cc8eddd5b7f9201ada2');
                            t.setAttribute('data-track-path', 'https://track.gaug.es/track.gif');
                            t.src = 'https://d2fuc4clr7gvcn.cloudfront.net/track.js';
                            var s = document.getElementsByTagName('script')[0];
                            s.parentNode.insertBefore(t, s);
                        })();
                    `}
                    </Script>
                </body>
            </Html>
        );
    }
}
