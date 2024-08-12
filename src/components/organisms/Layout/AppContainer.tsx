import {
  DARK_THEME,
  DEFAULT_THEME,
} from "src/components/atoms/Typography/Typography";
import { useDarkMode } from "src/hooks/useDarkMode";
import { ModeTheme, useAppTheme } from "src/stores/App.store";
import styled, { ThemeProvider } from "styled-components";

const AppContainerStyle = styled.div`
  height: 100vh;
  width: 100%;
  dislay: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.brand.background};
`;

export const AppContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <ThemeProvider theme={isDarkMode ? DARK_THEME : DEFAULT_THEME}>
      <AppContainerStyle>{children}</AppContainerStyle>
    </ThemeProvider>
  );
};
