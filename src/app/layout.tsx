import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme-provider";
import Bounded from "@/components/bounded";

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
};

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
            <Bounded>{children}</Bounded>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
