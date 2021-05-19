import {
    Tab, TabList,
} from '@chakra-ui/react';
import Header, { HeaderProps } from 'components/common/Header';
import NumberBadge, { BadgeSentiment } from 'components/common/NumberBadge';
import { Router } from 'next/router';
import React from 'react';

interface Tab {
    text: string;
    badge?: string;
    badgeSentiment?: BadgeSentiment
}

export interface TabsHeaderProps extends HeaderProps {
    tabs: (Tab | string)[];
    hashchange?: boolean;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({ tabs, hashchange = false, ...props }) => {
    const tabList = tabs.map((tab) => {
        if (typeof tab === 'string') {
            return { text: tab };
        }
        return tab;
    });

    return (
        <Header
            CenterComponent={(
                <TabList py={2}>
                    {tabList.map((tab, i) => (
                        <Tab
                            key={tab.text}
                            color="brand.100"
                            width="max-content"
                            mx={1}
                            onClick={() => {
                                const as = `#panel=${i}`;
                                if (hashchange) window.location.hash = as;
                                Router.events.emit('hashChangeStart', as);
                            }}
                        >
                            {tab.text}
                            {Boolean(tab.badge) && (
                                <NumberBadge
                                    ml={2}
                                    mr={-2}
                                    sentiment={tab.badgeSentiment}
                                >
                                    {tab.badge}
                                </NumberBadge>
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
