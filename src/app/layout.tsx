import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { AntdRegistry } from "@ant-design/nextjs-registry";
import NextAuthWrapper from "@/library/next.auth.wrapper";
import { ThemeProvider } from "@/components/(shadcn)/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITRAN EDU",
  description: "Your Professional Marketplace",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html style={{ height: "100%" }} lang="en" suppressHydrationWarning>
      <body
        style={{ height: "100%" }}
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <SessionProvider> */}
            <NextAuthWrapper >{children}</NextAuthWrapper>
          {/* </SessionProvider> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
