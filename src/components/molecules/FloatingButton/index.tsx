import React from "react";
import Button, { ButtonProps } from "src/components/atoms/Buttons";
import { styled } from "styled-components";

const Container = styled.div`
  position: fixed;
  bottom: 16px;
  right: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FloatingButton: React.FC<ButtonProps & { position: "bottom" }> = ({
  position = "bottom",
  ...buttonProps
}) => {
  return (
    <Container>
      <Button
        {...buttonProps}
        style={{
          width: "fit-content",
          borderRadius: 32,
        }}
      />
    </Container>
  );
};
