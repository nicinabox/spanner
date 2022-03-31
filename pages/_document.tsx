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
                <Head>
                    <link rel="icon" href="/favicon.ico" />

                    <link rel="manifest" href="/manifest.json" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />

                    {/* <!-- For non-Retina (@1× display) iPhone, iPod Touch, and Android 2.1+ devices: --> */}
                    {/* <!-- 57×57px --> */}
                    <link rel="apple-touch-icon" href="/assets/apple-touch-icon-precomposed.png" />
                    {/* <!-- For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≤ 6: --> */}
                    <link rel="apple-touch-icon" sizes="72x72" href="/assets/apple-touch-icon-72x72-precomposed.png" />
                    {/* <!-- For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≥ 7: --> */}
                    <link rel="apple-touch-icon" sizes="76x76" href="/assets/apple-touch-icon-76x76-precomposed.png" />
                    {/* <!-- For iPhone with @2× display running iOS ≤ 6: --> */}
                    <link rel="apple-touch-icon" sizes="114x114" href="/assets/apple-touch-icon-114x114-precomposed.png" />
                    {/* <!-- For iPhone with @2× display running iOS ≥ 7: --> */}
                    <link rel="apple-touch-icon" sizes="120x120" href="/assets/apple-touch-icon-120x120-precomposed.png" />
                    {/* <!-- For iPad with @2× display running iOS ≤ 6: --> */}
                    <link rel="apple-touch-icon" sizes="144x144" href="/assets/apple-touch-icon-144x144-precomposed.png" />
                    {/* <!-- For iPad with @2× display running iOS ≥ 7: --> */}
                    <link rel="apple-touch-icon" sizes="152x152" href="/assets/apple-touch-icon-152x152-precomposed.png" />
                    {/* <!-- For iPhone 6 Plus with @3× display: --> */}
                    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon-180x180-precomposed.png" />
                    {/* <!-- For Chrome for Android: --> */}
                    <link rel="icon" sizes="192x192" href="/assets/apple-touch-icon-192x192.png" />

                    <link href="//fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet" type="text/css" />
                </Head>
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
