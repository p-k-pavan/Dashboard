// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { ThemeProvider } from "@/components/theme-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HR Performance Dashboard",
  description: "Advanced HR management and performance tracking dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}