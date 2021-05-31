import React from 'react';

export interface ScriptProps {
    children: string;
}

export const Script: React.FC<ScriptProps> = ({ children }) => {
    return (
        // eslint-disable-next-line react/no-danger
        <script dangerouslySetInnerHTML={{ __html: children }} />
    );
};

export default Script;
