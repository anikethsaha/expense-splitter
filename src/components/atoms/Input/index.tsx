import React, { use, useState } from "react";
import { debounce } from "src/utils/debounce";
import styled, { useTheme } from "styled-components";
import {
  DEFAULT_THEME,
  TitleSmall,
  typographyStyles,
} from "../Typography/Typography";

interface InputProps {
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  type: "text" | "number";
  inputColor?: string;
  label?: string;
  rightElement?: React.ReactNode;
}

const InputContainer = styled.input<{ color?: string }>`
  width: 100%;
  border: 1px solid #b9b9b9;
  border-radius: 4px;
  padding: 4px 12px;
  height: 48px;
  box-sizing: border-box;
  font-size: ${typographyStyles.titleSmall.fontSize};
  font-weight: 400;
  font-style: ${typographyStyles.titleMedium.fontStyle};
  line-height: ${typographyStyles.titleMedium.lineHeight};
  text-decoration: ${typographyStyles.titleMedium.textDecoration};
  text-transform: ${typographyStyles.titleMedium.textTransform};
  color: ${(props) => props.color || props.theme.base.base1};
  letter-spacing: 0.15px;

  &:hover {
    border-color: ${(props) => props.theme.base.base2};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.brand.primary};
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative
  width: 100%;
`;

const RightContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 12px;
  bottom: 12px;
`;

export const Input: React.FC<
  InputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">
> = ({
  defaultValue = "",
  placeholder = "",
  onChange,
  type = "text",
  inputColor,
  label,
  rightElement,
  ...inputProps
}) => {
  const { base } = useTheme();
  const [value, setValue] = useState(defaultValue);

  const handleBlur = () => {
    if (onChange) {
      onChange(value);
    }
  };

  const debouncedOnChange = debounce((newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  }, 300);

  const handleDebounceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <InputWrapper>
      {label && <TitleSmall color={base.base2}>{label}</TitleSmall>}
      <InputContainer
        {...inputProps}
        color={inputColor}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleDebounceChange}
        onBlur={handleBlur}
      />
      {rightElement && <RightContainer>{rightElement}</RightContainer>}
    </InputWrapper>
  );
};
