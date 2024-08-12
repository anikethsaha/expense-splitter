"use client";

import dynamic from "next/dynamic";
import React from "react";

const GroupDetailScreen = dynamic(
  () => import("src/components/templates/Group/Detail").then((mod) => mod),
  {
    ssr: false,
  }
);

export const GroupDetail = ({ params }: { params: { id: string } }) => {
  return <GroupDetailScreen id={params.id} />;
};

export default GroupDetail;
