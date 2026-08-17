"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/common/sidebar";
import { TopBar } from "@/components/common/top-bar";
import { useAuth } from "@/lib/auth-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/signup";
  const isCreatePage = pathname === "/create";

  React.useEffect(() => {
    if (!isLoggedIn && !isPublicPage && !isCreatePage) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoggedIn, isPublicPage, isCreatePage, pathname, router]);

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
