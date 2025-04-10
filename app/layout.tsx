import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import Nav from "@/components/navigation/nav";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-providers";
import Toaster from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"], 
})

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
      <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
          <div className="flex-grow px-6 md:px-12 mx-auto max-w-8xl">
            <Nav />
            <Toaster />
            {children}
          </div>
        </ThemeProvider>
        </body>
    </html>
  );
}
