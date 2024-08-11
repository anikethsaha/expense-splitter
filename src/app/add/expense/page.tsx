"use client";

import React from "react";
import { AppContainer } from "src/components/organisms/Layout/AppContainer";
import { AuthLayer } from "src/components/organisms/Layout/AuthLayer";
import { CreateSplit } from "src/components/templates/Split/CreateSplit";
import { Provider } from "react-redux";
import { store } from "src/stores/redux.store";

export const CreateExpenseScreen = () => {
  return (
    <AppContainer>
      <AuthLayer>
        <Provider store={store}>
          <CreateSplit />
        </Provider>
      </AuthLayer>
    </AppContainer>
  );
};
export default CreateExpenseScreen;
