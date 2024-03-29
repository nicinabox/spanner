import {
    useColorMode, IconButton, useColorModeValue, Tooltip,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React from 'react';

export interface ColorModeButtonProps {
    variant?: string;
}

export const ColorModeButton: React.FC<ColorModeButtonProps> = ({ variant = 'ghost-header' }) => {
    const { toggleColorMode } = useColorMode();
    const Icon = useColorModeValue(MoonIcon, SunIcon);
    const nextMode = useColorModeValue('dark', 'light');
    const label = `Switch to ${nextMode} mode`;

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
