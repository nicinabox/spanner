import { Menu, MenuButton, Button, MenuList, MenuItem, MenuDivider, MenuItemOption, MenuOptionGroup, Spacer, Input, useMenuItem, Box, useDisclosure } from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';
import { updateVehicle, Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { mutate, useMutation } from 'hooks/useRequest';

export interface VehicleActionsMenuProps {
    vehicle: Vehicle;
}

export const VehicleActionsMenu: React.FC<VehicleActionsMenuProps> = ({ vehicle }) => {
    const { mutate: updateVehicleMutation } = useMutation(updateVehicle);

    const handleRetiredChange = () => {
        const data = { retired: !vehicle.retired };
        mutate(vehiclePath(vehicle.id), { ...vehicle, ...data }, false);
        updateVehicleMutation(vehicle.id, data);
    }

    const handleColorChange = (e) => {
        const color = e.target.value;
        const data = { color };
        mutate(vehiclePath(vehicle.id), { ...vehicle, ...data }, false);
        updateVehicleMutation(vehicle.id, data);
    }

    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="brand" size="sm">
                {vehicle.name}
            </MenuButton>
            <MenuList>
                <MenuItem>Change name</MenuItem>
                <MenuItem closeOnSelect={false} as="label" htmlFor="color">
                    Change color
                    <Spacer />
                    <input type="color" id="color" name="color" value={vehicle.color} onClick={e => e.stopPropagation()} onChange={handleColorChange} />
                </MenuItem>
                <MenuItem
                    onClick={handleRetiredChange}
                    icon={vehicle.retired ? <CheckIcon /> : <Spacer />}
                    iconSpacing={0}
                    flexDir="row-reverse"
                    closeOnSelect={false}
                >
                    Mark retired
                </MenuItem>
                <MenuDivider />
                <MenuOptionGroup title="View" type="checkbox">
                    <MenuItemOption value="show_cost_column" closeOnSelect={false} flexDir="row-reverse" iconSpacing={0}>
                        Show cost column
                    </MenuItemOption>
                    <MenuItemOption value="show_mileage_column" closeOnSelect={false} flexDir="row-reverse" iconSpacing={0}>
                        Show mileage delta
                    </MenuItemOption>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuItem>Import from CSV</MenuItem>
                <MenuItem>Export to CSV</MenuItem>
                <MenuDivider />
                <MenuItem>Print</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default VehicleActionsMenu;
