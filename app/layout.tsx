import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-red-hat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "InfraJam at UCI",
  description: "Concept app for an ALUG@UCI-hosted hackathon",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
