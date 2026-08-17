"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "../theme-provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between shrink-0 border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-zinc-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
      >
        Dollar Prompt
      </Link>

      {/* Theme Picker */}
      <div className="flex items-center rounded-md border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-900">
        {(["light", "dark", "system"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-medium capitalize transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30",
              theme === t
                ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </header>
  );
}
