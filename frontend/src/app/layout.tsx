import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from "sonner";
import { Toaster as Toast } from "@/components/ui/toaster";
import Providers from "@/components/layout/providers";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meducalc",
  description: "Meducalc App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader showSpinner={false} />
        <Providers>
          <main className="flex min-h-[100dvh] flex-col overflow-x-hidden antialiased">
            <Suspense fallback={<div>Load...</div>}>{children}</Suspense>
          </main>
        </Providers>
        <Sonner />
        <Toast />
      </body>
    </html>
  );
}
