import React from "react";
import { BiCheckbox } from "react-icons/bi";
import { BiCheckboxChecked } from "react-icons/bi";
import { useTheme } from "styled-components";

export const Checkbox: React.FC<{
  val: boolean;
  onChange: (val: boolean) => void;
}> = ({ val = false, onChange }) => {
  const { brand } = useTheme();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {!val ? (
        <BiCheckbox
          color={brand.primary}
          size={24}
          onClick={() => onChange(true)}
        />
      ) : (
        <BiCheckboxChecked
          color={brand.primary}
          size={24}
          onClick={() => onChange(false)}
        />
      )}
    </div>
  );
};
export default Checkbox;
