import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/ui/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapVote - Create and Share Polls",
  description: "Create, share, and analyze polls with SnapVote",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="py-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto">
            © {new Date().getFullYear()} SnapVote. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
