import { Menu, MenuButton, Button, MenuList, MenuItem, MenuDivider, MenuItemOption } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Vehicle } from 'queries/vehicles';
import React from 'react';

export interface VehicleActionsMenuProps {
    vehicle: Vehicle;
}

export const VehicleActionsMenu: React.FC<VehicleActionsMenuProps> = ({ vehicle }) => {
    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="brand" size="sm">
                {vehicle.name}
            </MenuButton>
            <MenuList>
                <MenuItem>Change name</MenuItem>
                <MenuItem>Change color</MenuItem>
                <MenuItemOption isChecked={vehicle.retired} flexDirection="row-reverse">
                    Mark retired
                </MenuItemOption>
                <MenuDivider />
                <MenuItemOption isChecked={true} flexDirection="row-reverse">
                    Show cost column
                </MenuItemOption>
                <MenuItemOption isChecked={true} flexDirection="row-reverse">
                    Show mileage delta
                </MenuItemOption>
                <MenuDivider />
                <MenuItem>Import from CSV</MenuItem>
                <MenuItem>Export to CSV</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default VehicleActionsMenu;
