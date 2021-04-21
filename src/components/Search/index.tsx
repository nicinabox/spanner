import { Input } from '@chakra-ui/react';
import React from 'react';

export interface SearchProps {
}

export const Search: React.FC<SearchProps> = ({  }) => {
    return (
        <Input placeholder="Search" bg="brand.700" border="none" />
    );
};

export default Search;
