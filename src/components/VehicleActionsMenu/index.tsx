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
                Actions
            </MenuButton>
            <MenuList>
                <MenuItem>Edit</MenuItem>
                <MenuDivider />
                <MenuItem>Import Records</MenuItem>
                <MenuItem>Export Records</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default VehicleActionsMenu;
