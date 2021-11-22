---
to: "<%= locals.path ? `src/components/${path}/${name}/${name}.tsx` : `src/components/${name}/${name}.tsx` %>"
---
import React from 'react';

export interface <%= name %>Props {
}

export const <%= name %>: React.FC<<%= name %>Props> = ({  }) => {
    return (
    );
};

export default <%= name %>;
