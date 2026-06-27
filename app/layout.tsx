import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import { NetworkBackground } from "../components/NetworkBackground";
import { NavBar } from "../components/NavBar";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-red-hat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "OpsJam @ UCI",
  description: "UCI Irvine's infrastructure-focused hackathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={redHatDisplay.variable}
    >
      <body className="min-h-full flex flex-col">
        <NetworkBackground />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
