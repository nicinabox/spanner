import {
    Badge, Box, Container, ContainerProps, Flex, HStack, SimpleGrid, Spacer, Tabs,
} from '@chakra-ui/react';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ColorModeButton from '../ColorModeButton';

export interface PageProps extends ContainerProps {
    Header?: JSX.Element;
}

export const parseHashParams = (url: string) => {
    const hashParams = url.replace(/^.*#/, '').split(',');
    return hashParams.reduce<Record<string, string>>((acc, param) => {
        const [key, value] = param.split('=');
        return { ...acc, [key]: value };
    }, {});
};

export const Page: React.FC<PageProps> = ({ children, Header, ...containerProps }) => {
    const router = useRouter();
    const [panel, setPanel] = useState(0);

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
        <Tabs colorScheme="brandInverted" size="sm" variant="soft-rounded" isLazy lazyBehavior="keepMounted" index={panel}>
            <SimpleGrid templateRows="auto 1fr auto" minH="100vh">
                {Header}

                <Container maxW="none" mb={12} {...containerProps}>
                    {children}
                </Container>

                <Flex justify="space-between" align="center" p={4}>
                    <ColorModeButton variant="ghost" />
                    <Badge colorScheme="gray" textTransform="none">v3.next</Badge>
                </Flex>
            </SimpleGrid>
        </Tabs>
    );
};

export default Page;
