import {
    Badge,
    Container,
    ContainerProps,
    Flex,
    SimpleGrid,
    Spacer,
    Tabs,
} from '@chakra-ui/react';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { SWRConfig } from 'swr';

export interface PageProps extends ContainerProps {
    Header?: JSX.Element;
    contextValue?: Record<string, unknown>;
    fallback?: Record<string, any>;
}

export const parseHashParams = (url: string) => {
    const hashParams = url.replace(/^.*#/, '').split(',');
    return hashParams.reduce<Record<string, string>>((acc, param) => {
        const [key, value] = param.split('=');
        return { ...acc, [key]: value };
    }, {});
};

export const PageContext = React.createContext<{ isShared?: boolean }>({});

export const Page: React.FC<PageProps> = ({
    children,
    contextValue,
    Header,
    fallback = {},
    ...containerProps
}) => {
    const router = useRouter();
    const [panel, setPanel] = useState(0);

    const contextValueMemo = useMemo(() => contextValue ?? {}, [contextValue]);

    useEffect(() => {
        const params = parseHashParams(router.asPath);
        if (params.panel) {
            setPanel(Number(params.panel));
        }
    }, [router.asPath]);

    useEffect(() => {
        const handler = (url: string) => {
            const params = parseHashParams(url);
            setPanel(Number(params.panel) || 0);
        };

        Router.events.on('hashChangeStart', handler);

        return () => {
            Router.events.off('hashChangeStart', handler);
        };
    }, []);

    return (
        <PageContext.Provider value={contextValueMemo}>
            <SWRConfig value={{ fallback, revalidateOnMount: true }}>
                <Tabs
                    colorScheme="brandInverted"
                    size="sm"
                    variant="soft-rounded"
                    isLazy
                    lazyBehavior="keepMounted"
                    index={panel}
                >
                    <SimpleGrid templateRows="auto 1fr auto" minH="100vh">
                        {Header}

                        <Container maxW="none" mb={12} {...containerProps}>
                            {children}
                        </Container>

                        <Flex justify="space-between" align="center" p={4}>
                            <Spacer />
                            <Badge colorScheme="gray" textTransform="none">
                                v3.
                                {process.env.CONFIG_BUILD_ID ?? 'next'}
                            </Badge>
                        </Flex>
                    </SimpleGrid>
                </Tabs>
            </SWRConfig>
        </PageContext.Provider>
    );
};

export default Page;
