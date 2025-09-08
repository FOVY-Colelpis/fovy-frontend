import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/Navigation";
import { AuthProvider } from "../contexts/AuthContext";
import AutoLoginNotification from "../components/AutoLoginNotification";

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
        <AuthProvider>
          <Navigation />
          {children}
          <AutoLoginNotification />
        </AuthProvider>
      </body>
    </html>
  );
}
