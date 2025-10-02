import {
    Image,
    Skeleton,
    Menu,
    MenuButton,
    MenuGroup,
    MenuItem,
    MenuList,
    Text,
    Button,
} from '@chakra-ui/react';
import crypto from 'crypto';
import useRequest from 'hooks/useRequest';
import React from 'react';

const shortenEmail = (value: string) => {
    const [match] = /.+@/.exec(value) || [value];
    return match;
};

const gravatarUrl = (email: string) => {
    const hash = crypto.createHash('md5').update(email).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}.jpg?default=identicon`;
};

export const UserMenu: React.FC = () => {
    const { data: user } = useRequest<API.User>('/api/user');

    return (
        <Menu>
            <Skeleton isLoaded={Boolean(user)}>
                <MenuButton
                    rightIcon={
                        user && (
                            <Image
                                borderRadius="full"
                                boxSize={6}
                                src={gravatarUrl(user.email)}
                            />
                        )
                    }
                    colorScheme="brand"
                    as={Button}
                    size="sm"
                    variant="ghost-header"
                >
                    <Text isTruncated maxW="100%" display={['none', 'block']}>
                        {user?.email && shortenEmail(user.email)}
                    </Text>
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
