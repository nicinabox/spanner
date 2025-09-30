import {
    useColorMode,
    IconButton,
    useColorModeValue,
    Tooltip,
    useStyleConfig,
    useToken,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React, { useEffect } from 'react';

export interface ColorModeButtonProps {
    variant?: string;
}

export const ColorModeButton: React.FC<ColorModeButtonProps> = ({
    variant = 'ghost-header',
}) => {
    const { toggleColorMode } = useColorMode();
    const Icon = useColorModeValue(MoonIcon, SunIcon);
    const nextMode = useColorModeValue('dark', 'light');
    const label = `Switch to ${nextMode} mode`;

    const headerStyles = useStyleConfig('Header');
    const headerBg = useToken('colors', headerStyles.bg as string);

    useEffect(() => {
        document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute('content', headerBg);
    }, [headerBg]);

    return (
        <Tooltip label={label}>
            <IconButton
                aria-label={label}
                onClick={toggleColorMode}
                colorScheme="brand"
                variant={variant}
                icon={<Icon />}
                size="sm"
            />
        </Tooltip>
    );
};

export default ColorModeButton;
