import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Script from "next/script";
import NavBar from "@/components/nav-bar";

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
        <Script
          type="module"
          src="https://gradio.s3-us-west-2.amazonaws.com/6.6.0/gradio.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          <NavBar />
          <div className="flex min-h-screen max-w-3xl mx-auto pt-20">
            <div className="flex w-full my-4 mx-2">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
