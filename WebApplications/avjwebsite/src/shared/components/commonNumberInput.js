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
import {BsBagFill} from 'react-icons/bs'

//Custom imports
import { config } from "../../environment";


const CommonNumberInput = ({
    defaultValue = null,
    min = null,
    max = undefined,
    w = '100%',
    h = null,
    maxW = null,
    maxH = null,
    mb=undefined,
    onChange = () => { },
    onBlur = () => { },
    value,
    precision = true,
    priceIcon = true,
    bagIcon = false,
    readOnly = false
 }) => {

    //Function used to handle number input changes
    const handleChange = (value) => {
        onChange(value)
    }

    return (
        <Box mb={mb}>
            <InputGroup >
                {priceIcon || bagIcon? <InputLeftAddon children={priceIcon ? <BiRupee /> : <BsBagFill />} /> : false}
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
                    isReadOnly={readOnly}
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