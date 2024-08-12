"use client";

import dynamic from "next/dynamic";
const HomeScreen = dynamic(
  () => import("src/components/templates/Home").then((mod) => mod.HomeScreen),
  {
    ssr: false,
  }
);

export default function Home() {
  return <HomeScreen />;
}
