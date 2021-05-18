import { useColorMode } from '@chakra-ui/react';

export default () => {
    const { colorMode } = useColorMode();

    return (light: string, dark: string) => (colorMode === 'light' ? light : dark);
};
