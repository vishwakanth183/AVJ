import React from 'react';
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Box, InputLeftAddon, InputGroup
} from '@chakra-ui/react'
import { BiRupee } from 'react-icons/bi'

//Custom imports
import { config } from "../../environment";


const CommonNumberInput = ({ defaultValue = null, min = null, max = undefined, w = '100%', h = null, maxW = null, maxH = null, onChange = () => { }, onBlur = () => { }, value, precision = true, priceIcon = true }) => {

    //Function used to handle number input changes
    const handleChange = (value) => {
        onChange(value)
    }

    return (
        <Box>
            <InputGroup>
                {priceIcon ? <InputLeftAddon children={<BiRupee />} /> : false}
                <NumberInput
                    defaultValue={defaultValue}
                    precision={precision ? 2 : 0}
                    min={min}
                    max={max}
                    w={w}
                    h={h}
                    maxW={maxW}
                    maxH={maxH}
                    value={value}
                    onBlur={onBlur}
                    onChange={handleChange}
                >
                    <NumberInputField fontFamily={config.fontFamily} />
                    <NumberInputStepper fontFamily={config.fontFamily}>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </InputGroup>
        </Box>
    );
}

export default CommonNumberInput;