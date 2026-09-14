import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Dynamics",
  description:
    "A computational modeling laboratory for systems, calculus, optimization, and valuation.",

  icons: {
    icon: [
      {
        url: "/Asset-Dynamics.png",
        type: "image/png",
      },
    ],
    shortcut: "/Asset-Dynamics.png",
    apple: "/Asset-Dynamics.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
