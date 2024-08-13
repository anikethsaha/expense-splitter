import React from "react";
import { LuSettings } from "react-icons/lu";
import { IoIosArrowRoundBack } from "react-icons/io";

import { FiPlus } from "react-icons/fi";

import { TitleMedium } from "src/components/atoms/Typography/Typography";
import styled, { useTheme } from "styled-components";
import { IconType } from "react-icons";
import { BottomSheet } from "src/components/molecules/BottomSheet";
import { Settings } from "src/components/templates/Settings";
import {
  Container,
  ProgressBar,
  TitleWrapper,
  IconContainer,
} from "./Navbar.styled";

export const Navbar: React.FC<{
  hideActions?: boolean;
  onBack?: () => void;
  onAddClick?: () => void;
  progress?: number;
}> = ({ hideActions = false, onBack, onAddClick, progress }) => {
  const { brand } = useTheme();
  const [showSettings, setShowSettings] = React.useState(false);

  const onSettingsClick = () => {
    setShowSettings((prev) => !prev);
  };

  return (
    <>
      <Container isProgress={!!progress}>
        {!!progress && <ProgressBar progress={progress} />}
        <TitleWrapper>
          {!!onBack && (
            <IoIosArrowRoundBack
              onClick={onBack}
              size={24}
              color={brand.primary}
            />
          )}
          <TitleMedium color={brand.primary}>Split Expense</TitleMedium>
        </TitleWrapper>
        {!hideActions && (
          <IconContainer>
            {!!onAddClick && (
              <FiPlus
                size={24}
                style={{ cursor: "pointer" }}
                color={brand.primary}
                onClick={onAddClick}
              />
            )}
            <LuSettings
              size={24}
              color={brand.primary}
              onClick={onSettingsClick}
            />
          </IconContainer>
        )}
      </Container>
      <BottomSheet
        snapPoints={[400]}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      >
        <Settings />
      </BottomSheet>
    </>
  );
};
