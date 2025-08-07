import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme-provider";
import Bounded from "@/components/bounded";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/sidebar";
import SidebarProviderHandler from "@/providers/sidebar-provider-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Safe Spend",
    default: "Safe Spend",
  },
  description:
    "Take control of your finances with Safe Spend. Easily track your expenses, set budgets, and achieve your saving goals with a clean and intuitive interface.",
  keywords: [
    "Safe Spend",
    "budget app",
    "expense tracker",
    "money management",
    "personal finance",
    "save money",
    "budget planner",
    "track spending",
  ],
  authors: [
    { name: "Anas Attoum", url: "https://anas-attoum-portfolio.vercel.app" },
  ],
  creator: "Anas Attoum",
  manifest: '/manifest.json',
  icons: {
    icon: '/safeSpend_rounded.png',
    apple: '/safeSpend_maskable.png',
  },
};

export function generateViewport() {
  return {
    themeColor: "#023e8a", // or any color you want
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProviderHandler>
              <AppSidebar />
              {/* <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
              </div> */}
              <Bounded>
                {children}
              </Bounded>
            </SidebarProviderHandler>
          </ThemeProvider>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
