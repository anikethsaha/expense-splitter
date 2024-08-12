import React from "react";
import { MdDarkMode } from "react-icons/md";

import { CiLight } from "react-icons/ci";
import { StyledContainer } from "src/components/atoms/Common/StyledContainer";
import {
  TitleMedium,
  TitleSmall,
} from "src/components/atoms/Typography/Typography";
import styled, { useTheme } from "styled-components";
import { useDarkMode } from "src/hooks/useDarkMode";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
`;

export const Settings = () => {
  const { brand } = useTheme();
  const { isDarkMode, setAppTheme } = useDarkMode();

  return (
    <StyledContainer>
      <TitleMedium color={brand.primary}>Settings</TitleMedium>

      <Row style={{ marginTop: 24 }}>
        <TitleSmall>Theme</TitleSmall>
        {isDarkMode ? (
          <MdDarkMode
            size={24}
            color={brand.primary}
            onClick={() => setAppTheme(false)}
          />
        ) : (
          <CiLight
            color={brand.primary}
            size={24}
            onClick={() => setAppTheme(true)}
          />
        )}
      </Row>
    </StyledContainer>
  );
};
