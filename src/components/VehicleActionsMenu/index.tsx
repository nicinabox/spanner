import { Menu, MenuButton, Button, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
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
                <MenuItem>Edit</MenuItem>
                <MenuItem>View</MenuItem>
                <MenuItem>Change color</MenuItem>
                <MenuDivider />
                <MenuItem>Import from CSV</MenuItem>
                <MenuItem>Export to CSV</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default VehicleActionsMenu;
