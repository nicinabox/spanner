import { Menu, MenuButton } from '@chakra-ui/menu';
import { MenuList, MenuItem } from '@chakra-ui/react';
import { Skeleton } from '@chakra-ui/skeleton';
import useRequest from 'hooks/useRequest';
import { User } from 'queries/session';
import React from 'react';

export interface UserMenuProps {
}

export const UserMenu: React.FC<UserMenuProps> = ({  }) => {
    const { data: user } = useRequest<User>('/api/user');

    return (
        <Menu>
            <Skeleton isLoaded={Boolean(user)}>
                <MenuButton>
                    {user?.email}
                </MenuButton>
            </Skeleton>
            <MenuList>
                <MenuItem as="a" href="/logout">
                    Logout
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default UserMenu;
