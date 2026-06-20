import React from 'react';

export const HeadInjections: React.FC = () => {
    const injections = process.env.HEAD_INJECTIONS;
    if (!injections) return null;

    return (
        // eslint-disable-next-line react/no-danger
        <div dangerouslySetInnerHTML={{ __html: injections }} />
    );
};

export default HeadInjections;