import React from "react";
import { AuthLayer } from "./AuthLayer";
import { AppContainer } from "./AppContainer";

export const CustomLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <AppContainer>
      <AuthLayer>{children}</AuthLayer>
    </AppContainer>
  );
};
