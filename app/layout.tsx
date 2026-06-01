import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sample Counter",
  description: "A centered counter powered by a Quarkus endpoint"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
