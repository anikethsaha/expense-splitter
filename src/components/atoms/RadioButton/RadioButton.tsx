import React from "react";
import { CgRadioCheck } from "react-icons/cg";
import { useTheme } from "styled-components";
import { PiRadioButtonDuotone } from "react-icons/pi";

export const RadioButton: React.FC<{
  preSelected?: boolean;
  onSelect: () => void;
  onDeSelected: () => void;
}> = ({ preSelected, onSelect, onDeSelected }) => {
  const { brand } = useTheme();

  return (
    <>
      {preSelected ? (
        <PiRadioButtonDuotone
          onClick={onDeSelected}
          size={20}
          color={brand.primary}
        />
      ) : (
        <CgRadioCheck onClick={onSelect} size={20} color={brand.primary} />
      )}
    </>
  );
};
