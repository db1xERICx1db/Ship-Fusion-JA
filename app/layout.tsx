import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ship Fusion Jamaica | Your packages, our priority",
    template: "%s | Ship Fusion Jamaica",
  },
  description:
    "Fast, reliable air and sea freight from the United States to Jamaica. Ship Fusion Jamaica delivers your packages with care, convenience, and visibility.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
