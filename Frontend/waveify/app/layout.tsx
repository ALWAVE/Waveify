import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
// figtree
import "./globals.css";
import Sidebar from "@/component/Sidebar";
import ModalProvider from "@/providers/ModalProvider";
import Header from "@/component/Header";
import Player from "@/component/Player";
import TitleBar from "@/component/TitleBar";
import { AuthProvider } from "@/providers/AuthProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import AuthPoster from "@/component/AuthPoster";
import CookieConsent from "@/component/CookieConsent";
import DisableContextMenu from "@/component/DisableContextMenu";


const figtree = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "Waveify",
  description: "MusicApp",
  themeColor: "#EB2855",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* PWA manifest и иконки */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#EB2855" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`bg-[var(--bg)] ${figtree.className}`}>
          <DisableContextMenu />
        <ToasterProvider />

        <AuthProvider>
          <ModalProvider />
          <CookieConsent />
          <div className="flex flex-col h-screen bg-[var(--bg)]">
            <Header />
            <TitleBar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 bg-[var(--bg)] h-[calc(100%-80px)] scroll-container overflow-y-auto pr-2 pl-2 relative z-0">
                {children}
              </main>
            </div>
            {/* <MobilePlayer />
            <MobileBar /> */}

            <Player />
            <AuthPoster />
            {/* <FullScreenPlayer /> */}
          </div>
        </AuthProvider>

      </body>
    </html>
  );
}
