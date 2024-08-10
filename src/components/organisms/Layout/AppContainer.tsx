import { DEFAULT_THEME } from "src/components/atoms/Typography/Typography";
import styled, { ThemeProvider } from "styled-components";
import { AuthLayer } from "./AuthLayer";

const AppContainerStyle = styled.div`
  height: 100vh;
  width: 100%;
  dislay: flex;
  flex-direction: column;
`;

export const AppContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      <AppContainerStyle>{children}</AppContainerStyle>
    </ThemeProvider>
  );
};
