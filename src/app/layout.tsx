import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { DeviceProvider } from "@/app/contexts/DeviceContext"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <main className="min-h-screen">
          <DeviceProvider>{children}</DeviceProvider>
        </main>
        <Toaster />
      </body>
    </html>
  </ClerkProvider>
  );
}
