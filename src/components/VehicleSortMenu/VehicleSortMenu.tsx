import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Button, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, useBreakpointValue,
} from '@chakra-ui/react';
import { capitalize, lowerCase } from 'lodash';
import React from 'react';
import { vehicleSortStrategy, VehicleSortStrategy } from 'utils/sortable';

export interface VehicleSortMenuProps {
    onChange: (value: VehicleSortStrategy) => void;
    sortStrategy: VehicleSortStrategy;
}

const strategytoHuman = (sortStrategy: VehicleSortStrategy) => {
    return capitalize(lowerCase(sortStrategy));
};

export const VehicleSortMenu: React.FC<VehicleSortMenuProps> = ({ sortStrategy, onChange: onChangeProp }) => {
    const size = useBreakpointValue({ sm: 'xs', base: 'sm' });

    return (
        <Menu>
            <MenuButton as={Button} size={size} rightIcon={<ChevronDownIcon />}>
                Sort:
                {' '}
                {strategytoHuman(sortStrategy)}
            </MenuButton>
            <MenuList>
                <MenuOptionGroup value={sortStrategy} type="radio" onChange={onChangeProp}>
                    {Object.keys(vehicleSortStrategy).map((value) => (
                        <MenuItemOption key={value} value={value}>
                            {strategytoHuman(value as VehicleSortStrategy)}
                        </MenuItemOption>
                    ))}
                </MenuOptionGroup>
            </MenuList>
        </Menu>
    );
};

export default VehicleSortMenu;
