import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/Navigation";

export const metadata: Metadata = {
  title: "FOVY - Freelance Career Platform",
  description: "AI-powered career system for freelancers",
  viewport: "width=device-width, initial-scale=1, user-scalable=yes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans" style={{margin: 0, padding: 0}}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
