import React from 'react';

import { Meta } from '@storybook/react';
import { HStack, Tabs } from '@chakra-ui/react';

import VehicleActionsMenu from 'components/VehicleActionsMenu';
import vehicle from '__fixtures__/vehicle';
import { TabsHeader, TabsHeaderProps } from './TabsHeader';
import BackButton from '../BackButton';

const Template: React.VFC<TabsHeaderProps> = (props) => {
    return (
        <Tabs colorScheme="brandInverted" size="sm" variant="soft-rounded">
            <TabsHeader
                LeftComponent={(
                    <HStack spacing={2}>
                        <BackButton>
                            Vehicles
                        </BackButton>

                        <VehicleActionsMenu vehicle={vehicle} />
                    </HStack>
                  )}
                {...props}
            />
        </Tabs>
    );
};

export const Default = Template.bind({});
Default.args = {
    tabs: [
        'Service',
        { text: 'Maintenance', badge: 3, badgeSentiment: 'warning' },
        'Notes',
    ],
};

export default {
    title: 'Components/TabsHeader',
    component: TabsHeader,
} as Meta;
