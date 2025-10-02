import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import {
    orderToHuman,
    vehicleSortOrderToHuman,
    vehicleSortStrategy,
    VehicleSortStrategy,
    vehicleSortStrategyToHuman,
} from 'utils/sortable';

export interface VehicleSortMenuProps {
    onChange: (value: [VehicleSortStrategy, API.Order]) => void;
    sortable: [VehicleSortStrategy, API.Order];
}

export const VehicleSortMenu: React.FC<VehicleSortMenuProps> = ({
    sortable,
    onChange: onChangeProp,
}) => {
    const size = useBreakpointValue({ sm: 'xs', base: 'sm' });
    const [sortStrategy, sortOrder] = sortable;

    return (
        <Menu>
            <MenuButton as={Button} size={size} rightIcon={<ChevronDownIcon />}>
                Order By: {orderToHuman(sortable)}{' '}
                {vehicleSortStrategyToHuman[sortStrategy]}
            </MenuButton>
            <MenuList zIndex={2}>
                <MenuOptionGroup
                    value={sortStrategy}
                    type="radio"
                    onChange={(v) =>
                        onChangeProp([v as VehicleSortStrategy, sortOrder])
                    }
                >
                    {Object.keys(vehicleSortStrategy).map((value) => (
                        <MenuItemOption key={value} value={value}>
                            {vehicleSortStrategyToHuman[value]}
                        </MenuItemOption>
                    ))}
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup
                    value={sortOrder}
                    type="radio"
                    onChange={(v) =>
                        onChangeProp([sortStrategy, v as API.Order])
                    }
                >
                    {vehicleSortOrderToHuman[sortStrategy].map((order, i) => (
                        <MenuItemOption
                            key={order}
                            value={i === 0 ? 'asc' : 'desc'}
                        >
                            {order}
                        </MenuItemOption>
                    ))}
                </MenuOptionGroup>
            </MenuList>
        </Menu>
    );
};

export default VehicleSortMenu;
