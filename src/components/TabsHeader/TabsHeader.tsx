import { Tab, TabList } from '@chakra-ui/react';
import Header, { HeaderProps } from 'components/Header';
import React from 'react';

export interface TabsHeaderProps extends HeaderProps {
    tabs: string[]
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({ tabs, ...props }) => {
    return (
        <Header
            CenterComponent={
                <TabList>
                    {tabs.map((tab, i) => (
                        <Tab key={i} color="brand.100">{tab}</Tab>
                    ))}
                </TabList>
            }
            {...props}
        />
    );
};

export default TabsHeader;
