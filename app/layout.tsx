import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Link from "next/link";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tour of Gradio",
  description: "Tour of Gradio",
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pretendard = localFont({
  src: "../public/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="var(--background)" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          <div className="flex min-h-svh w-full flex-col px-4 sm:px-6 lg:px-8">
            <NavBar />
            <main className="flex flex-1 flex-col">{children}</main>
            <footer className="my-6 flex h-12 items-center justify-center gap-1">
              <Button variant="link" className="text-foreground">
                <Link href="https://knlp.snu.ac.kr">2026 SNUNLP</Link>
              </Button>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
