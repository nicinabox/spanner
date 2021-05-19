import { CheckIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
    Button, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Skeleton, Spacer, Text,
} from '@chakra-ui/react';
import VehicleColorIndicator from 'components/VehicleColorIndicator';
import useMutation, { mutate } from 'hooks/useMutation';
import { debounce } from 'lodash';
import Link from 'next/link';
import { updateVehicle, Vehicle, vehiclePath } from 'queries/vehicles';
import React, { useCallback } from 'react';

export interface VehicleActionsMenuProps {
    vehicle: Vehicle | undefined;
}

export const VehicleActionsMenu: React.FC<VehicleActionsMenuProps> = ({ vehicle }) => {
    const { mutate: updateVehicleMutation } = useMutation(updateVehicle);

    const handleUpdateVehicle = (nextOptions: Partial<Vehicle>) => {
        if (!vehicle) return;
        mutate(vehiclePath(vehicle.id), { ...vehicle, ...nextOptions }, false);
        updateVehicleMutation(vehicle.id, nextOptions);
    };

    const debouncedUpdate = useCallback(debounce(handleUpdateVehicle, 200), [vehicle]);

    const handleColorChange = (e) => {
        const color = e.target.value;
        debouncedUpdate({ color });
    };

    const handlePrint = () => {
        setTimeout(() => {
            window.print();
        }, 200);
    };

    return (
        <Menu>
            <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost-header"
                size="sm"
                colorScheme="brandInverted"
                color="white"
            >
                {vehicle ? (
                    <HStack spacing={2}>
                        <VehicleColorIndicator color={vehicle?.color} />
                        <Text>{vehicle?.name}</Text>
                    </HStack>
                ) : (
                    <Skeleton minW={140} minH={3} startColor="whiteAlpha.100" endColor="whiteAlpha.400" />
                )}
            </MenuButton>

            {vehicle && (
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
                            onClick={(e) => e.stopPropagation()}
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

                    <MenuItem>Import records from CSV</MenuItem>
                    <MenuItem as="a" href={`${vehiclePath(vehicle.id)}/export`} target="_blank">
                        Export records to CSV
                    </MenuItem>

                    <MenuDivider />

                    <MenuItem onClick={handlePrint}>
                        Print
                    </MenuItem>
                </MenuList>
            )}
        </Menu>
    );
};

export default VehicleActionsMenu;
