"use client";

import React from "react";
import { AppContainer } from "src/components/organisms/Layout/AppContainer";
import { AuthLayer } from "src/components/organisms/Layout/AuthLayer";
import { CreateGroup } from "src/components/templates/Group/CreateScreen";

export const AddGroup = () => {
  return (
    <AppContainer>
      <AuthLayer>
        <CreateGroup />
      </AuthLayer>
    </AppContainer>
  );
};

export default AddGroup;
