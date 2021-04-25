import { Menu, MenuButton, Button, MenuList, MenuItem, MenuDivider, MenuItemOption } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { updateVehicle, Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { mutate, useMutation } from 'hooks/useRequest';

export interface VehicleActionsMenuProps {
    vehicle: Vehicle;
}

export const VehicleActionsMenu: React.FC<VehicleActionsMenuProps> = ({ vehicle }) => {
    const { mutate: updateVehicleMutation } = useMutation(updateVehicle);

    const handleRetiredChange = async (e) => {
        e.preventDefault();
        const data = { retired: !vehicle.retired };
        mutate(vehiclePath(vehicle.id), { ...vehicle, ...data }, false);
        await updateVehicleMutation(vehicle.id, data);
    }

    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="brand" size="sm">
                {vehicle.name}
            </MenuButton>
            <MenuList>
                <MenuItem>Change name</MenuItem>
                <MenuItem>Change color</MenuItem>
                <MenuItemOption onClick={handleRetiredChange} isChecked={vehicle.retired} flexDirection="row-reverse">
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
