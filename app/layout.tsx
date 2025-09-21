import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhatsNew Changelog Viewer",
  description:
    "Public, read-only viewer for changelog JSON files published via whatsnew.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground">
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
          {children}
        </div>
      </body>
    </html>
  );
}
