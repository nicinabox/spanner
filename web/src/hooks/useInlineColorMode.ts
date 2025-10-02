import { useColorMode } from '@chakra-ui/react';

export default function useInlineColorMode() {
    const { colorMode } = useColorMode();

    return (light: string, dark: string) =>
        colorMode === 'light' ? light : dark;
}
