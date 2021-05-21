import { useColorMode, IconButton, useColorModeValue } from '@chakra-ui/react';
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
        <IconButton
            onClick={toggleColorMode}
            colorScheme="brandInverted"
            variant={variant}
            aria-label={label}
            title={label}
            icon={<Icon />}
            size="sm"
        />
    );
};

export default ColorModeButton;
