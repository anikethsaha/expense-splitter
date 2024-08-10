"use client";

import React from "react";
import { AppContainer } from "src/components/organisms/Layout/AppContainer";
import { AuthLayer } from "src/components/organisms/Layout/AuthLayer";
import { CreateFriendScreen } from "src/components/templates/Friend/CreateScreen";

export const AddFriendPage = () => {
  return (
    <AppContainer>
      <AuthLayer>
        <CreateFriendScreen />
      </AuthLayer>
    </AppContainer>
  );
};

export default AddFriendPage;
