import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/layouts/Navbar";
import { cn, constructMetadata } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "@/components/layouts/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <ClerkProvider>
        <html lang="en">
          <body
            className={cn("min-h-screen antialiased grainy", inter.className)}
          >
            <Navbar />
            <Toaster />
            <SpeedInsights />
            {children}
            <Footer />
          </body>
        </html>
      </ClerkProvider>
    </Providers>
  );
}
