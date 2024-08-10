import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "../../lib/registry";
import { AppContainer } from "src/components/organisms/Layout/AppContainer";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className} style={{ margin: 0 }}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
