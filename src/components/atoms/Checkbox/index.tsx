import React from "react";
import { BiCheckbox } from "react-icons/bi";
import { BiCheckboxChecked } from "react-icons/bi";

export const Checkbox: React.FC<{
  val: boolean;
  onChange: (val: boolean) => void;
}> = ({ val = false, onChange }) => {
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
        <BiCheckbox size={24} onClick={() => onChange(true)} />
      ) : (
        <BiCheckboxChecked size={24} onClick={() => onChange(false)} />
      )}
    </div>
  );
};
export default Checkbox;
