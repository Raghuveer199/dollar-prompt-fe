"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

// Lucide icons — inline SVG for zero-dep
const icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  prompts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
    </svg>
  ),
  collections: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
      <path d="M2 6h20M2 12h20M2 18h20" />
    </svg>
  ),
  templates: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  playground: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

const primaryNav = [
  { href: "/dashboard", label: "Home", icon: icons.home },
  { href: "/prompts", label: "Prompts", icon: icons.prompts },
  { href: "/collections", label: "Collections", icon: icons.collections },
  { href: "/templates", label: "Templates", icon: icons.templates },
];

const secondaryNav = [
  { href: "/playground", label: "Playground", icon: icons.playground },
  { href: "/insights", label: "Insights", icon: icons.insights },
];

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group/item flex items-center h-9 rounded-lg transition-all duration-150 overflow-hidden",
        "px-2.5 gap-3 w-full",
        active
          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-200"
      )}
    >
      <span className="shrink-0 size-5 flex items-center justify-center">
        {icon}
      </span>
      <span className="text-[13px] font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75">
        {label}
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

  return (
    <>
      {/* Desktop Sidebar (md+) */}
      <div
        className={cn(
          "hidden md:flex group/sidebar fixed left-0 top-0 z-40 h-screen",
          "flex-col",
          "w-14 hover:w-[220px] transition-[width] duration-200 ease-out",
          "bg-white dark:bg-zinc-950",
          "border-r border-zinc-100 dark:border-zinc-900",
          "overflow-hidden"
        )}
      >
        {/* Logo */}
        <div className="shrink-0 flex items-center h-14 px-3.5 border-b border-zinc-100 dark:border-zinc-900">
          <div className="size-7 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/symbol-logo.png" alt="Dollar Prompt" className="size-7 object-contain" />
          </div>
          <div className="h-full ml-2.5 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75 shrink-0 flex items-center">
            <span className="dark:hidden text-zinc-900 font-bold text-xl"> Prompt </span>
            <span className="hidden dark:block font-bold text-xl"> Prompt </span>
          </div>
          {/* <div className="ml-2.5 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75 shrink-0 flex items-center">
            <img src="/light-full-logo.png" alt="Dollar Prompt" className="h-8 w-auto object-contain dark:hidden" />
            <img src="/dark-full-logo.png" alt="Dollar Prompt" className="h-8 w-auto object-contain hidden dark:block" />
          </div> */}
        </div>

        {/* Primary nav */}
        <nav className="flex-1 flex flex-col gap-0.5 px-2 pt-3 min-h-0 overflow-y-auto overflow-x-hidden">
          {primaryNav.map((item) => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} />
          ))}

          {/* Divider */}
          <div className="my-2 h-px bg-zinc-100 dark:bg-zinc-900 mx-0.5" />

          {secondaryNav.map((item) => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 flex flex-col gap-0.5 px-2 pb-3 border-t border-zinc-100 dark:border-zinc-900 pt-2">
          <NavItem href="/settings" label="Settings" icon={icons.settings} active={isActive("/settings")} />

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(nextTheme)}
            className="flex items-center h-9 rounded-lg px-2.5 gap-3 w-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-150"
            title={`Switch to ${nextTheme} mode`}
          >
            <span className="shrink-0 size-5 flex items-center justify-center">
              {theme === "dark" ? icons.sun : icons.moon}
            </span>
            <span className="text-[13px] font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75 capitalize">
              {theme === "dark" ? "Light mode" : theme === "light" ? "System" : "Dark mode"}
            </span>
          </button>
        </div>
      </div>
    </>
  );

}
