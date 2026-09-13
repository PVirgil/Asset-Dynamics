import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Dynamics",
  description: "A computational modeling laboratory for systems, calculus, optimization, and valuation."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
