import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinnTutto – Alle Apps auf einen Blick",
  description:
    "Das FinnTutto-Ökosystem: Immobilienverwaltung, Mieterportal, Zählerablesung und mehr – alle Apps zentral verlinkt.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06080f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
