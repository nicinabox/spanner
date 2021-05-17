import { useColorMode, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React from 'react';

export interface ColorModeButtonProps {
}

export const ColorModeButton: React.FC<ColorModeButtonProps> = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <IconButton
            onClick={toggleColorMode}
            variant="ghost"
            aria-label={colorMode === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode'}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            size="sm"
        />
    );
};

export default ColorModeButton;
