import type { Metadata, Viewport } from "next";
import { Geist, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "monkeyvim — learn vim by doing",
  description:
    "Practice vim motions, commands, and text objects in an interactive editor. Build muscle memory for vim keybindings at your own pace.",
  keywords: [
    "vim",
    "vim practice",
    "vim trainer",
    "vim motions",
    "learn vim",
    "vim keybindings",
    "vim commands",
    "neovim",
  ],
  metadataBase: new URL("https://monkeyvim.com"),
  openGraph: {
    title: "monkeyvim — learn vim by doing",
    description:
      "Practice vim motions, commands, and text objects in an interactive editor.",
    siteName: "monkeyvim",
    url: "https://monkeyvim.com",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "monkeyvim — learn vim by doing",
    description:
      "Practice vim motions, commands, and text objects in an interactive editor.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#333139",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
