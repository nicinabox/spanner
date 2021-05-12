import { Input } from '@chakra-ui/react';
import React from 'react';

export interface SearchProps {
    onChangeText: (text: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onChangeText }) => (
    <Input
        placeholder="Search records"
        colorScheme="brand"
        variant="filled"
        size="sm"
        maxWidth={['100%', 400]}
        onChange={(e) => {
            onChangeText(e.target.value);
        }}
    />
);

export default Search;
