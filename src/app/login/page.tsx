"use client";

import dynamic from "next/dynamic";
import React from "react";

const LoginScreen = dynamic(
  () => import("src/components/templates/Login").then((mod) => mod.LoginScreen),
  {
    ssr: false,
  }
);

export default function Login() {
  return <LoginScreen />;
}
