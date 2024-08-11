import React, { use, useState } from "react";
import { debounce } from "src/utils/debounce";
import styled, { useTheme } from "styled-components";
import {
  DEFAULT_THEME,
  TextSmall,
  TitleSmall,
  typographyStyles,
} from "../Typography/Typography";

export interface OwnInputProps {
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  type?: "text" | "number";
  inputColor?: string;
  label?: string;
  rightElement?: React.ReactNode;
  size?: "default" | "small";
}
export type InputProps = OwnInputProps &
  React.InputHTMLAttributes<HTMLInputElement>;

const InputContainer = styled.input<{
  color?: string;
  size?: InputProps["size"];
}>`
  width: 100%;
  border: 1px solid ${(props) => props.theme.stroke.light};
  border-radius: 4px;
  padding: 4px 12px;
  height: ${(props) => (props.size === "small" ? 32 : 48)}px;
  box-sizing: border-box;
  font-size: ${(props) =>
    props.size === "small"
      ? typographyStyles.textSmall.fontSize
      : typographyStyles.titleSmall.fontSize};
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

const InputWrapper = styled.div<{ size?: InputProps["size"] }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  width: 100%;
`;

const RightContainer = styled.div<{ size?: InputProps["size"] }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 12px;
  bottom: ${(props) => (props.size ? 6 : 14)}px;
`;

export const Input: React.FC<InputProps> = ({
  defaultValue = "",
  placeholder = "",
  onChange,
  type = "text",
  inputColor,
  label,
  rightElement,
  size = "default",
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

  const Text = size === "small" ? TextSmall : TitleSmall;

  return (
    <InputWrapper size={size}>
      {label && <Text color={base.base2}>{label}</Text>}
      <InputContainer
        {...inputProps}
        size={size}
        color={inputColor}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleDebounceChange}
        onBlur={handleBlur}
      />
      {rightElement && (
        <RightContainer size={size}>{rightElement}</RightContainer>
      )}
    </InputWrapper>
  );
};
