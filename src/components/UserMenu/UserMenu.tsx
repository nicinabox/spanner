import { Menu, MenuButton, MenuGroup } from '@chakra-ui/menu';
import { MenuList, MenuItem } from '@chakra-ui/react';
import { Skeleton } from '@chakra-ui/skeleton';
import useRequest from 'hooks/useRequest';
import { User } from 'queries/session';
import React from 'react';

export interface UserMenuProps {
}

const shortenEmail = (value: string) => {
    const [match] = /.+@/.exec(value) || [value];
    return match;
}

export const UserMenu: React.FC<UserMenuProps> = ({  }) => {
    const { data: user } = useRequest<User>('/api/user');

    return (
        <Menu>
            <Skeleton isLoaded={Boolean(user)}>
                <MenuButton color="brand.100">
                    {user?.email && shortenEmail(user.email)}
                </MenuButton>
            </Skeleton>
            <MenuList>
                <MenuGroup title={user?.email}>
                    <MenuItem as="a" href="/logout">
                        Logout
                    </MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    );
};

export default UserMenu;
