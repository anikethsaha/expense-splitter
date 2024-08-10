import React from "react";
import { LuSettings } from "react-icons/lu";
import { IoIosArrowRoundBack } from "react-icons/io";

import { FiPlus } from "react-icons/fi";

import { TitleMedium } from "src/components/atoms/Typography/Typography";
import styled, { useTheme } from "styled-components";
import { IconType } from "react-icons";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 48px;
  width: 100%;
  border-top: 3px solid ${(props) => props.theme.brand.primary};
  padding: 16px 16px 12px;

  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
`;

export const Navbar: React.FC<{
  hideActions?: boolean;
  onBack?: () => void;
  onAddClick?: () => void;
}> = ({ hideActions = false, onBack, onAddClick }) => {
  const { brand } = useTheme();

  const onSettingsClick = () => {
    console.log("Settings");
  };

  return (
    <Container>
      <TitleWrapper>
        {!!onBack && <IoIosArrowRoundBack size={24} color={brand.primary} />}
        <TitleMedium color={brand.primary}>Split Expense</TitleMedium>
      </TitleWrapper>
      {!hideActions && (
        <IconContainer>
          {!!onAddClick && (
            <FiPlus size={24} color={brand.primary} onClick={onAddClick} />
          )}
          <LuSettings
            size={24}
            color={brand.primary}
            onClick={onSettingsClick}
          />
        </IconContainer>
      )}
    </Container>
  );
};
