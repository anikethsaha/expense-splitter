import React, { FC, MouseEvent } from "react";

import styled, { useTheme } from "styled-components";
import { DEFAULT_THEME, TitleSmall } from "../Typography/Typography";
import { IconBaseProps, IconType } from "react-icons";

export type ButtonProps = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onHover?: () => void;
  leadingIcon?: (props: IconBaseProps) => IconType;
  trailingIcon?: (props: IconBaseProps) => IconType;
  text?: string;
  type?: "primary" | "secondary";
  style?: React.CSSProperties;
  rightText?: string;
  rightElement?: React.ReactNode;
  disabled?: boolean;
};

const ButtonWrapper = styled.button<{
  type: string;
  hasRightText?: boolean;
  disabled?: boolean;
}>`
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  background-color: ${(props) =>
    props.type === "secondary"
      ? props.theme.brand.alternative
      : props.theme.brand.primary};
  border: 1px solid
    ${(props) =>
      props.type !== "secondary"
        ? props.theme.brand.alternative
        : props.theme.brand.primary};
  width: 100%;
  border-radius: 4px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 14px;
  padding-bottom: 14px;
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.hasRightText ? "space-between" : "center"};
  align-items: center;
  gap: 6px;
  position: relative;
  color: ${(props) =>
    props.type === "secondary"
      ? props.theme.brand.primary
      : props.theme.brand.alternative};
`;

const ButtonText = styled(TitleSmall)`
  font-weight: 500;
  letter-spacing: 0.5px;
  f
`;

const LeftContainer = styled.div<{ hasRightText?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  justify-content: ${(props) => (props.hasRightText ? "start" : "center")};
  width: 100%;
  position: relative;
  flex: 1;
`;
const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  justify-content: center;
`;

const Button: FC<ButtonProps> = ({
  onClick,
  onHover,
  leadingIcon,
  trailingIcon,
  text,
  type = "primary",
  rightText,
  rightElement,
  style,
  disabled,
}) => {
  const { brand, base } = useTheme();
  const handleHover = () => {
    if (onHover) {
      onHover();
    }
  };

  return (
    <ButtonWrapper
      hasRightText={!!rightText || !!rightElement}
      onClick={disabled ? () => {} : onClick}
      onMouseEnter={handleHover}
      type={type}
      style={style}
      disabled={disabled}
    >
      <LeftContainer hasRightText={!!rightText || !!rightElement}>
        {leadingIcon?.({
          size: 18,
          color: brand.alternative,
        })}
        {text && (
          <ButtonText
            style={{ letterSpacing: "0.5px" }}
            color={type === "secondary" ? brand.primary : brand.alternative}
          >
            {text}
          </ButtonText>
        )}
        {trailingIcon?.({
          size: 18,
          color: brand.alternative,
        })}
      </LeftContainer>

      {rightText ||
        (!!rightElement && (
          <RightContainer>
            {!!rightText && (
              <TitleSmall color={base.baseLighter1}>{rightText}</TitleSmall>
            )}
            {rightElement}
          </RightContainer>
        ))}
    </ButtonWrapper>
  );
};

export default Button;
