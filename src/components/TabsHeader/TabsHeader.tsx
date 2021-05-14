import {
    Box, Spacer, Tab, TabList,
} from '@chakra-ui/react';
import Header, { HeaderProps } from 'components/Header';
import React from 'react';

export interface TabsHeaderProps extends HeaderProps {
    tabs: string[];
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({ tabs, ...props }) => (
    <Header
        CenterComponent={(
            <TabList justifyContent={['start', 'center']} mt={[2, null, 0]}>
                {tabs.map((tab) => (
                    <Tab key={tab} color="brand.100" width="max-content">{tab}</Tab>
                ))}
            </TabList>
              )}
        {...props}
    />
);

export default TabsHeader;
