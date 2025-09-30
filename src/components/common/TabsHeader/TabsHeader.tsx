import { Tab, TabList } from '@chakra-ui/react';
import Header, { HeaderProps } from 'components/common/Header';
import NumberBadge, { BadgeSentiment } from 'components/common/NumberBadge';
import { Router } from 'next/router';
import React from 'react';

interface Tab {
    text: string;
    children?: React.ReactNode;
    badgeSentiment?: BadgeSentiment;
}

export interface TabsHeaderProps extends HeaderProps {
    tabs: (Tab | string)[];
    hashchange?: boolean;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
    tabs,
    hashchange = false,
    ...props
}) => {
    const tabList = tabs.map((tab) => {
        if (typeof tab === 'string') {
            return { text: tab };
        }
        return tab;
    });

    return (
        <Header
            CenterComponent={
                <TabList
                    py={2}
                    justifyContent={['space-evenly', 'center']}
                    flex={1}
                >
                    {tabList.map((tab, i) => (
                        <Tab
                            key={tab.text}
                            color="brand.100"
                            width="max-content"
                            textTransform="capitalize"
                            mx={[0, 1]}
                            onClick={(e) => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                e.target.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'nearest',
                                });

                                const as = `#panel=${i}`;
                                if (hashchange) window.location.hash = as;
                                Router.events.emit('hashChangeStart', as);
                            }}
                        >
                            {tab.text}
                            {Boolean(tab.children) && (
                                <NumberBadge
                                    ml={2}
                                    mr={-2}
                                    gap={1}
                                    sentiment={tab.badgeSentiment}
                                >
                                    {tab.children}
                                </NumberBadge>
                            )}
                        </Tab>
                    ))}
                </TabList>
            }
            {...props}
        />
    );
};

export default TabsHeader;
