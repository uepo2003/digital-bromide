"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "ブロマイド管理", icon: Image },
    { href: "/admin/users", label: "ユーザー管理", icon: Users },
  ];

  // ユーザー受け取り画面の場合はナビゲーションを表示しない
  if (pathname.startsWith("/receive")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-700">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              電子ブロマイド
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "bg-slate-700 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

