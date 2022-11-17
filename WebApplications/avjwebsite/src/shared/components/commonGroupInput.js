import React from "react";
import { InputGroup, InputLeftAddon, Box, Input } from "@chakra-ui/react";
import { config } from "../../environment";

const CommonGroupInput = ({
  children = null,
  bg = null,
  name = '',
  value = null,
  color = null,
  disabled = false,
  placeholder = '',
  borderLeftRadius = null,
  borderLeft = null,
  onChange = () => { },
  onBlur = () => { },
  w = undefined,
  pb = undefined,
  mb = undefined,
  centerAlign = undefined,
  readOnly = false
}) => {

  //Function to handle onChange
  const handleChange = (event) => {
    console.log('input event', event?.target?.value)
    onChange(event?.target?.value)
  }

  return (
    <Box>
      <InputGroup>
        {children ? <InputLeftAddon children={children} bg={bg} /> : null}
        <Input
          name={name}
          value={value}
          w={w ? w : undefined}
          color={color}
          pb={pb}
          mb={mb}
          onBlur={onBlur}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          borderLeftRadius={borderLeftRadius}
          borderLeft={borderLeft}
          fontFamily={config.fontFamily}
          readOnly={readOnly}
          textAlign={centerAlign ? 'center' : undefined}
        />
      </InputGroup>
    </Box>
  );
}

export default CommonGroupInput;