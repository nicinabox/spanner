import {
    HStack, Image, Skeleton,
    Menu, MenuButton, MenuGroup, MenuItem, MenuList, Text, Button,
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
    return `https://www.gravatar.com/avatar/${hash}.jpg?default=identicon`;
};

export const UserMenu: React.FC<UserMenuProps> = () => {
    const { data: user } = useRequest<User>('/api/user');

    return (
        <Menu>
            <Skeleton isLoaded={Boolean(user)}>
                <MenuButton colorScheme="brand" as={Button} size="sm" variant="ghost-header">
                    <HStack spacing={2} alignItems="center">
                        <Text>
                            {user?.email && shortenEmail(user.email)}
                        </Text>
                        {user && (
                            <Image
                                borderRadius="full"
                                boxSize={6}
                                src={gravatarUrl(user.email)}
                            />
                        )}
                    </HStack>
                </MenuButton>
            </Skeleton>
            <MenuList>
                <MenuGroup title={user?.email}>
                    <MenuItem as="a" href="/logout">
                        🌴 Sign out
                    </MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    );
};

export default UserMenu;
