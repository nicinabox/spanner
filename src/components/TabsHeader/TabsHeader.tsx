import {
    Box,
    Circle,
    Tab, TabList,
} from '@chakra-ui/react';
import Header, { HeaderProps } from 'components/Header';
import React from 'react';

interface Tab {
    text: string;
    badge?: string;
}

export interface TabsHeaderProps extends HeaderProps {
    tabs: (Tab | string)[];
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({ tabs, ...props }) => {
    const tabList = tabs.map((tab) => {
        if (typeof tab === 'string') {
            return { text: tab };
        }
        return tab;
    });

    return (
        <Header
            CenterComponent={(
                <TabList>
                    {tabList.map((tab) => (
                        <Tab key={tab.text} color="brand.100" width="max-content">
                            {tab.text}
                            {Boolean(tab.badge) && (
                                <Circle
                                    ml={2}
                                    mr={-2}
                                    minW={5}
                                    px={2}
                                    bg="brand.200"
                                    color="brand.500"
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
