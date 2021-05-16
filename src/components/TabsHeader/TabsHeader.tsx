import {
    Box,
    Circle,
    Tab, TabList,
} from '@chakra-ui/react';
import Header, { HeaderProps } from 'components/Header';
import { useRouter } from 'next/router';
import React from 'react';

type BadgeSentiment = 'neutral' | 'warning' | 'negative';

interface Tab {
    text: string;
    badge?: string;
    badgeSentiment?: BadgeSentiment
}

export interface TabsHeaderProps extends HeaderProps {
    tabs: (Tab | string)[];
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({ tabs, ...props }) => {
    const router = useRouter();

    const tabList = tabs.map((tab) => {
        if (typeof tab === 'string') {
            return { text: tab };
        }
        return tab;
    });

    const getBadgeBg = (sentiment: BadgeSentiment | undefined) => {
        if (sentiment === 'warning') return 'orange.300';
        if (sentiment === 'negative') return 'red.200';
        if (sentiment === 'neutral') return 'brand.200';
        return 'brand.200';
    };

    return (
        <Header
            CenterComponent={(
                <TabList>
                    {tabList.map((tab, i) => (
                        <Tab
                            key={tab.text}
                            color="brand.100"
                            width="max-content"
                            onClick={() => {
                                router.push({
                                    query: {
                                        ...router.query,
                                        panelId: i,
                                    },
                                });
                            }}
                        >
                            {tab.text}
                            {Boolean(tab.badge) && (
                                <Circle
                                    ml={2}
                                    mr={-2}
                                    minW={5}
                                    px={2}
                                    bg={getBadgeBg(tab.badgeSentiment)}
                                    color="brand.500"
                                    shadow="sm"
                                    fontSize="xs"
                                    fontWeight="900"
                                >
                                    {tab.badge}
                                </Circle>
                            )}
                        </Tab>
                    ))}
                </TabList>
            )}
            {...props}
        />
    );
};

export default TabsHeader;
