import { Input } from '@chakra-ui/react';
import React from 'react';

export interface SearchProps {
}

export const Search: React.FC<SearchProps> = ({  }) => {
    return (
        <Input
            placeholder="Search records"
            colorScheme="brand"
            variant="filled"
            size="sm"
            width={400}
        />
    );
};

export default Search;
