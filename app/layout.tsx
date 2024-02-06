import { ClerkProvider } from '@clerk/nextjs'
import Navbar from "@/components/layouts/Navbar";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart PDF",
  description: "Smart PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <ClerkProvider>
        <html lang="en">
          <body className={cn('min-h-screen antialiased grainy', inter.className)}>
            <Navbar />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </Providers>
  );
}
