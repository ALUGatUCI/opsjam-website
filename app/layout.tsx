import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
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
      className={jetbrainsMono.className}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
