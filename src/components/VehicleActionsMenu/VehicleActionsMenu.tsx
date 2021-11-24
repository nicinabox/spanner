import { CheckIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
    Box, Button, HStack, Input, InputGroup, InputRightElement, Menu, MenuButton, MenuDivider, MenuItem, MenuList,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
    ModalHeader, ModalOverlay, Skeleton, Spacer, Text,
    useDisclosure,
} from '@chakra-ui/react';
import VehicleColorIndicator from 'components/VehicleColorIndicator';
import VehicleShareSettings from 'components/VehicleShareSettings';
import useMutation, { mutate } from 'hooks/useMutation';
import { debounce, merge } from 'lodash';
import Link from 'next/link';
import {
    updateVehicle, Vehicle, vehicleAPIPath, VehicleParams,
} from 'queries/vehicles';
import React, { useCallback } from 'react';
import { editVehiclePath, vehicleImportPath } from 'utils/resources';

export interface VehicleActionsMenuProps {
    vehicle: Vehicle | undefined;
}

export const VehicleActionsMenu: React.FC<VehicleActionsMenuProps> = ({ vehicle }) => {
    const { mutate: updateVehicleMutation } = useMutation(updateVehicle);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleUpdateVehicle = (params: VehicleParams) => {
        if (!vehicle) return;

        mutate(vehicleAPIPath(vehicle.id), merge({}, vehicle, params), false);
        updateVehicleMutation({ id: vehicle.id, ...params });
    };

    const debouncedUpdate = useCallback(debounce(handleUpdateVehicle, 200), [vehicle]);

    const handleColorChange = (e) => {
        const color = e.target.value;
        debouncedUpdate({ color });
    };

    return (
        <>
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
                        <Link href={editVehiclePath(vehicle.id)} passHref>
                            <MenuItem as="a">
                                Edit
                            </MenuItem>
                        </Link>
                        <MenuItem closeOnSelect={false} as="label" htmlFor="color">
                            Change color
                            <Spacer />
                            <Box display="none">
                                <input
                                    type="color"
                                    id="color"
                                    name="color"
                                    value={vehicle.color ?? ''}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={handleColorChange}
                                />
                            </Box>
                            <VehicleColorIndicator color={vehicle?.color} />
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

                        <MenuItem onClick={onOpen}>
                            Share...
                        </MenuItem>

                        <MenuDivider />

                        <Link href={vehicleImportPath(vehicle.id)} passHref>
                            <MenuItem as="a">
                                Import history
                            </MenuItem>
                        </Link>
                        <MenuItem as="a" href={`${vehicleAPIPath(vehicle.id)}/export`} target="_blank">
                            Export history to CSV
                        </MenuItem>
                    </MenuList>
                )}
            </Menu>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Share</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        {Boolean(vehicle) && (
                            <VehicleShareSettings vehicle={vehicle!} />
                        )}
                    </ModalBody>

                    <ModalFooter />
                </ModalContent>
            </Modal>
        </>
    );
};

export default VehicleActionsMenu;
