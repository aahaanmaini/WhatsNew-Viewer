import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What's New?",
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
        <div className="min-h-screen bg-background">
          <div className="mx-auto w-full max-w-4xl px-6 py-14 sm:px-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
