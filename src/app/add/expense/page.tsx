"use client";

import React from "react";
import dynamic from "next/dynamic";

const CreateSplitScreen = dynamic(
  () =>
    import("src/components/templates/Split/CreateSplit").then(
      (mod) => mod.CreateSplitScreen
    ),
  {
    ssr: false,
  }
);

export const CreateExpenseScreen = () => {
  return <CreateSplitScreen />;
};
export default CreateExpenseScreen;
