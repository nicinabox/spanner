import { SearchIcon } from '@chakra-ui/icons';
import {
    Input, InputGroup, InputLeftElement, useColorModeValue,
} from '@chakra-ui/react';
import useInlineColorMode from 'hooks/useInlineColorMode';
import React from 'react';

export interface SearchProps {
    onChangeText: (text: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onChangeText }) => {
    const cm = useInlineColorMode();

    return (
        <InputGroup>
            <InputLeftElement
                pointerEvents="none"
            >
                <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
                placeholder="Search"
                colorScheme="gray"
                bg={cm('blackAlpha.200', 'blackAlpha.600')}
                _hover={{ bg: cm('blackAlpha.400', 'blackAlpha.900') }}
                _placeholder={{ color: cm('gray.600', 'gray.100') }}
                variant="filled"
                size="md"
                maxWidth={[null, 350]}
                onChange={(e) => {
                    onChangeText(e.target.value);
                }}
            />
        </InputGroup>
    );
};

export default Search;
