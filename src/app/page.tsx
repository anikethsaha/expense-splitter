"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { AppContainer } from "src/components/organisms/Layout/AppContainer";
import { AuthLayer } from "src/components/organisms/Layout/AuthLayer";
import { HomeScreen } from "src/components/templates/Home";

export default function Home() {
  return (
    <AppContainer>
      <AuthLayer>
        <HomeScreen />
      </AuthLayer>
    </AppContainer>
  );
}
