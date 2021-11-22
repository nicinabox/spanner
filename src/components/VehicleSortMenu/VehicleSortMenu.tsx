import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Button, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup,
} from '@chakra-ui/react';
import { capitalize, lowerCase } from 'lodash';
import React, { useState } from 'react';
import { vehicleSortStrategy, VehicleSortStrategy } from 'utils/sortable';

export interface VehicleSortMenuProps {
    onChange: (value: VehicleSortStrategy) => void;
    sortStrategy: VehicleSortStrategy;
    defaultSortStrategy: VehicleSortStrategy;
}

const strategytoHuman = (sortStrategy: VehicleSortStrategy) => {
    return capitalize(lowerCase(sortStrategy));
};

export const VehicleSortMenu: React.FC<VehicleSortMenuProps> = ({ sortStrategy, defaultSortStrategy, onChange: onChangeProp }) => {
    return (
        <Menu>
            <MenuButton as={Button} size="xs" rightIcon={<ChevronDownIcon />}>
                Sort:
                {' '}
                {strategytoHuman(sortStrategy)}
            </MenuButton>
            <MenuList>
                <MenuOptionGroup defaultValue={defaultSortStrategy} type="radio" onChange={onChangeProp}>
                    {Object.keys(vehicleSortStrategy).map((value) => (
                        <MenuItemOption key={value} value={value}>{strategytoHuman(value as VehicleSortStrategy)}</MenuItemOption>
                            ))}
                </MenuOptionGroup>
            </MenuList>
        </Menu>
    );
};

export default VehicleSortMenu;
