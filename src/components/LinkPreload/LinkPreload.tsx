import Head from 'next/head';
import React from 'react';

export interface LinkPreloadProps {
    path: string | string[]
}

export const LinkPreload: React.FC<LinkPreloadProps> = ({ path }) => {
    const paths = ([] as string[]).concat(path);

    return (
        <Head>
            {paths.map((href) => (
                <link key={href} rel="preload" href={href} as="fetch" crossOrigin="anonymous" />
            ))}
        </Head>
    );
};

export default LinkPreload;
