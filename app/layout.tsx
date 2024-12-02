import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import "./globals.css";

export const metadata: Metadata = {
  title: "IronEase",
  description: "Professional Ironing Service Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}