import { CheckIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import { mutate, useMutation } from 'hooks/useRequest';
import Link from 'next/link';
import { updateVehicle, Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';

export interface VehicleActionsMenuProps {
    vehicle: Vehicle;
}

export const VehicleActionsMenu: React.FC<VehicleActionsMenuProps> = ({ vehicle }) => {
    const { mutate: updateVehicleMutation } = useMutation(updateVehicle);

    const handleUpdateVehicle = (nextOptions: Partial<Vehicle>) => {
        mutate(vehiclePath(vehicle.id), { ...vehicle, ...nextOptions }, false);
        updateVehicleMutation(vehicle.id, nextOptions);
    }

    const handleColorChange = (e) => {
        const color = e.target.value;
        handleUpdateVehicle({ color });
    }

    const handlePrint = () => {
        setTimeout(() => {
            window.print()
        }, 200)
    }

    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="brand" size="sm">
                {vehicle.name}
            </MenuButton>
            <MenuList>
                <Link href={`/vehicles/${vehicle.id}/edit`} passHref>
                    <MenuItem as="a">
                        Edit
                    </MenuItem>
                </Link>
                <MenuItem closeOnSelect={false} as="label" htmlFor="color">
                    Change color
                    <Spacer />
                    <input
                        type="color"
                        id="color"
                        name="color"
                        value={vehicle.color ?? ''}
                        onClick={e => e.stopPropagation()}
                        onChange={handleColorChange}
                    />
                </MenuItem>

                <MenuItem
                    onClick={() => handleUpdateVehicle({ retired: !vehicle.retired })}
                    icon={vehicle.retired ? <CheckIcon /> : <Spacer />}
                    iconSpacing={0}
                    flexDir="row-reverse"
                    closeOnSelect={false}
                >
                    Mark retired
                </MenuItem>

                <MenuDivider />

                <MenuItem
                    onClick={() => handleUpdateVehicle({ enableCost: !vehicle.enableCost })}
                    icon={vehicle.enableCost ? <CheckIcon /> : <Spacer />}
                    iconSpacing={0}
                    flexDir="row-reverse"
                    closeOnSelect={false}
                >
                    Show cost column
                </MenuItem>

                <MenuDivider />

                <MenuItem>Import from CSV</MenuItem>
                <MenuItem>Export to CSV</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handlePrint}>
                    Print
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default VehicleActionsMenu;
