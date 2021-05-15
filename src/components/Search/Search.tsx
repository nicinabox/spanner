import { Input } from '@chakra-ui/react';
import React from 'react';

export interface SearchProps {
    onChangeText: (text: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onChangeText }) => (
    <Input
        placeholder="Search by date, mileage, or notes"
        colorScheme="gray"
        variant="filled"
        size="md"
        maxWidth={[null, 350]}
        onChange={(e) => {
            onChangeText(e.target.value);
        }}
    />
);

export default Search;
