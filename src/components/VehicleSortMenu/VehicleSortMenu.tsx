import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Button, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import { vehicleSortStrategy, VehicleSortStrategy, vehicleSortStrategyToHuman } from 'utils/sortable';

export interface VehicleSortMenuProps {
    onChange: (value: VehicleSortStrategy) => void;
    sortStrategy: VehicleSortStrategy;
}

export const VehicleSortMenu: React.FC<VehicleSortMenuProps> = ({ sortStrategy, onChange: onChangeProp }) => {
    const size = useBreakpointValue({ sm: 'xs', base: 'sm' });

    return (
        <Menu>
            <MenuButton as={Button} size={size} rightIcon={<ChevronDownIcon />}>
                Sort:
                {' '}
                {vehicleSortStrategyToHuman[sortStrategy]}
            </MenuButton>
            <MenuList>
                <MenuOptionGroup value={sortStrategy} type="radio" onChange={onChangeProp}>
                    {Object.keys(vehicleSortStrategy).map((value) => (
                        <MenuItemOption key={value} value={value}>
                            {vehicleSortStrategyToHuman[value]}
                        </MenuItemOption>
                    ))}
                </MenuOptionGroup>
            </MenuList>
        </Menu>
    );
};

export default VehicleSortMenu;
