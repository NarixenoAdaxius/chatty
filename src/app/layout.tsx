import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { validateEnvironment } from "@/lib/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Validate environment variables on app startup
if (typeof window === "undefined") {
  validateEnvironment();
}

export const metadata: Metadata = {
  title: "Chatty - Modern Messaging",
  description: "A modern, real-time messaging application built with Next.js, Clerk, and Convex",
  keywords: ["chat", "messaging", "real-time", "communication"],
  authors: [{ name: "Chatty Team" }],
  creator: "Chatty Team",
  publisher: "Chatty Team",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Chatty - Modern Messaging",
    description: "Connect with friends and colleagues through our modern messaging platform",
    type: "website",
    siteName: "Chatty",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatty - Modern Messaging",
    description: "Connect with friends and colleagues through our modern messaging platform",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(262.1 83.3% 57.8%)",
          colorBackground: "hsl(0 0% 100%)",
          colorInputBackground: "hsl(0 0% 100%)",
          colorInputText: "hsl(222.2 84% 4.9%)",
          colorText: "hsl(222.2 84% 4.9%)",
          colorTextSecondary: "hsl(215.4 16.3% 46.9%)",
        },
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
          card: "bg-card",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              {children}
              <Toaster position="top-right" />
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}