import React from 'react';
import { Center, Spinner } from '@chakra-ui/react'

const CommonLoader = ({ h = '100vh' }) => {
    return (
        <Center h={h}>
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='teal'
                size='xl'
            />
        </Center>
    );
}

export default CommonLoader;