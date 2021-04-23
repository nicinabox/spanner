import { Box } from '@chakra-ui/react';
import marked from 'marked';
import Head from 'next/head';
import React from 'react';

export interface VehicleNotesProps {
    notes: string;
}

const styles = {
    '& *': {
        fontFamily: 'monospace'
    }
}

export const VehicleNotes: React.FC<VehicleNotesProps> = ({ notes }) => {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css" integrity="sha512-Oy18vBnbSJkXTndr2n6lDMO5NN31UljR8e/ICzVPrGpSud4Gkckb8yUpqhKuUNoE+o9gAb4O/rAxxw1ojyUVzg==" crossorigin="anonymous" />
            </Head>

            <Box className="markdown-body" sx={styles} dangerouslySetInnerHTML={{ __html: marked(notes) }} />
        </>
    );
};

export default VehicleNotes;
