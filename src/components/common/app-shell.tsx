"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/common/sidebar";
import { TopBar } from "@/components/common/top-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (isPublicPage) {
    return (
      <main className="flex-1 h-full w-full overflow-hidden font-sans text-zinc-900 dark:text-zinc-100">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:pl-14 h-full overflow-hidden">
        <TopBar />
        <main className="flex-1 min-h-0 overflow-hidden font-sans text-zinc-900 dark:text-zinc-100">
          {children}
        </main>
      </div>
    </>
  );

}
