import {
    HStack, Image, Skeleton,
    Menu, MenuButton, MenuGroup, MenuItem, MenuList, Text,
} from '@chakra-ui/react';
import crypto from 'crypto';
import useRequest from 'hooks/useRequest';
import { User } from 'queries/session';
import React from 'react';

export interface UserMenuProps {
}

const shortenEmail = (value: string) => {
    const [match] = /.+@/.exec(value) || [value];
    return match;
};

const gravatarUrl = (email: string) => {
    const hash = crypto
        .createHash('md5')
        .update(email)
        .digest('hex');
    return `https://www.gravatar.com/avatar/${hash}.jpg`;
};

export const UserMenu: React.FC<UserMenuProps> = () => {
    const { data: user } = useRequest<User>('/api/user');

    return (
        <Menu>
            <Skeleton isLoaded={Boolean(user)}>
                <MenuButton color="brand.100">
                    <HStack spacing={2}>
                        <Text>
                            {user?.email && shortenEmail(user.email)}
                        </Text>
                        {user && (
                            <Image
                                borderRadius="full"
                                boxSize={6}
                                src={gravatarUrl(user.email)}
                                alt="gravatar"
                            />
                        )}
                    </HStack>
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
