import Document, { Html, Head, Main, NextScript } from 'next/document'

class ApplicationDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <title>Spanner</title>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="description" content="The easiest way keep service records for all your vehicles." />

                    {/* <!-- For non-Retina (@1× display) iPhone, iPod Touch, and Android 2.1+ devices: --> */}
                    {/* <!-- 57×57px --> */}
                    <link rel="apple-touch-icon-precomposed" href="/assets/apple-touch-icon-precomposed.png" />
                    {/* <!-- For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≤ 6: --> */}
                    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/assets/apple-touch-icon-72x72-precomposed.png" />
                    {/* <!-- For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≥ 7: --> */}
                    <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/assets/apple-touch-icon-76x76-precomposed.png" />
                    {/* <!-- For iPhone with @2× display running iOS ≤ 6: --> */}
                    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/assets/apple-touch-icon-114x114-precomposed.png" />
                    {/* <!-- For iPhone with @2× display running iOS ≥ 7: --> */}
                    <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/assets/apple-touch-icon-120x120-precomposed.png" />
                    {/* <!-- For iPad with @2× display running iOS ≤ 6: --> */}
                    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/assets/apple-touch-icon-144x144-precomposed.png" />
                    {/* <!-- For iPad with @2× display running iOS ≥ 7: --> */}
                    <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/assets/apple-touch-icon-152x152-precomposed.png" />
                    {/* <!-- For iPhone 6 Plus with @3× display: --> */}
                    <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/assets/apple-touch-icon-180x180-precomposed.png" />
                    {/* <!-- For Chrome for Android: --> */}
                    <link rel="icon" sizes="192x192" href="/assets/apple-touch-icon-192x192.png" />

                    <link href='//fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css' />
                    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet" />
                </Head>
            
                <Head />
            
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default ApplicationDocument;