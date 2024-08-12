"use client";

import dynamic from "next/dynamic";
import React from "react";

const CreateGroup = dynamic(
  () =>
    import("src/components/templates/Group/CreateScreen").then(
      (mod) => mod.CreateGroup
    ),
  {
    ssr: false,
  }
);

export const AddGroup = () => {
  return <CreateGroup />;
};

export default AddGroup;
