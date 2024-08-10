"use client";

import React from "react";
import { AppContainer } from "src/components/organisms/Layout/AppContainer";
import { AuthLayer } from "src/components/organisms/Layout/AuthLayer";
import { CreateSplit } from "src/components/templates/Split/CreateSplit";

export const CreateExpenseScreen = () => {
  return (
    <AppContainer>
      <AuthLayer>
        <CreateSplit />
      </AuthLayer>
    </AppContainer>
  );
};
export default CreateExpenseScreen;
