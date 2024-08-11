"use client";
import React from "react";
import { AppContainer } from "src/components/organisms/Layout/AppContainer";
import { AuthLayer } from "src/components/organisms/Layout/AuthLayer";
import GroupDetailScreen from "src/components/templates/Group/Detail";

export const GroupDetail = ({ params }: { params: { id: string } }) => {
  return (
    <AppContainer>
      <AuthLayer>
        <GroupDetailScreen id={params.id} />
      </AuthLayer>
    </AppContainer>
  );
};

export default GroupDetail;
