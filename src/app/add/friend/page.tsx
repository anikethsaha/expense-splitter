"use client";

import dynamic from "next/dynamic";
import React from "react";

const CreateFriendScreen = dynamic(
  () =>
    import("src/components/templates/Friend/CreateScreen").then(
      (mod) => mod.CreateFriendScreen
    ),
  {
    ssr: false,
  }
);

export const AddFriendPage = () => {
  return <CreateFriendScreen />;
};

export default AddFriendPage;
