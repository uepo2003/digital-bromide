import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "電子ブロマイド配布システム",
  description: "クラウドファンディングの返礼品として配る電子ブロマイドを管理・配布するシステム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
