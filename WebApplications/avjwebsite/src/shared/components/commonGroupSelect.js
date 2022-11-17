import React from "react";
import { InputGroup, InputLeftAddon } from "@chakra-ui/react";
import CommonSelect from "./select";

const CommonGroupSelect = (props) => {
  return (
    <InputGroup>
      <InputLeftAddon children={props.children} bg={props.bg} />
      <CommonSelect
        value={props.value}
        name={props.name}
        disabled={props.disabled}
        onChange={props.onChange}
        option={props.option}
        placeholder={props.placeholder}
        borderLeft={props.borderLeft}
        borderLeftRadius={props.borderLeftRadius}
      />
    </InputGroup>
  );
}

export default CommonGroupSelect;