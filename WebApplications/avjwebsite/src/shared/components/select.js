import React from "react";
import { Select } from "@chakra-ui/react";

const CommonSelect = (props) => {
  return (
    <Select
      name={props.name}
      disabled={props.disabled}
      onChange={props.onChange}
      placeholder={props.placeholder}
      borderRadius={props.borderRadius}
      borderLeft={props.borderLeft}
      borderLeftRadius={props.borderLeftRadius}
    >
      {props.option &&
        props.option.map((data, index) => (
          <option key={index}>{data.name}</option>
        ))}
    </Select>
  );
}

export default CommonSelect;