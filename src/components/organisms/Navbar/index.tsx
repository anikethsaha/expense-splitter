import React from "react";
import { LuSettings } from "react-icons/lu";
import { IoIosArrowRoundBack } from "react-icons/io";

import { FiPlus } from "react-icons/fi";

import { TitleMedium } from "src/components/atoms/Typography/Typography";
import styled, { useTheme } from "styled-components";
import { IconType } from "react-icons";

const Container = styled.div<{ isProgress?: boolean }>`
  display: flex;
  flex-direction: row;
  height: 48px;
  width: 100%;
  border-top: ${(props) => (props.isProgress ? 0 : 3)}px solid
    ${(props) => props.theme.brand.primary};
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

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  width: ${(props) => props.progress}%;
  background-color: ${(props) => props.theme.brand.primary};
  transition: width 0.5s;
`;

export const Navbar: React.FC<{
  hideActions?: boolean;
  onBack?: () => void;
  onAddClick?: () => void;
  progress?: number;
}> = ({ hideActions = false, onBack, onAddClick, progress }) => {
  const { brand } = useTheme();

  const onSettingsClick = () => {
    console.log("Settings");
  };

  return (
    <Container isProgress={!!progress}>
      {!!progress && <ProgressBar progress={progress} />}
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
