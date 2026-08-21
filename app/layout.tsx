import type { Metadata } from "next";
import "./globals.css";
import MusicPlayer from "./components/MusicPlayer";
import Header from "./components/Header";


export const metadata: Metadata = {
  title: "Souls Gate",
  description: "Enter the Darkness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}

        <Header />
        <MusicPlayer />
      </body>
    </html>
  );
}