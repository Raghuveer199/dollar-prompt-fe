"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { PromptStore } from "@/lib/prompt-store";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

// Search icon
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/prompts", label: "Prompts" },
  { href: "/collections", label: "Collections" },
  { href: "/templates", label: "Templates" },
  { href: "/playground", label: "Playground" },
  { href: "/insights", label: "Insights" },
  { href: "/settings", label: "Settings" },
];

export function TopBar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [prompts, setPrompts] = useState<{ id: string; title: string; description?: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    setPrompts(PromptStore.getPrompts());
  }, []);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const filtered = prompts.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    setOpen(false);
    router.push(`/prompt/${id}`);
  };

  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

  return (
    <>
      <header className="shrink-0 h-14 flex items-center gap-3 px-4 sm:px-5 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 z-30 relative">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="md:hidden p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Mobile Logo Link */}
        <Link href="/dashboard" className="md:hidden flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/symbol-logo.png" alt="Dollar Prompt" className="size-6 rounded-lg object-contain" />
        </Link>

        {/* Search trigger */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 text-[13px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 sm:px-3 py-1.5 transition-colors w-full max-w-[180px] sm:max-w-xs md:w-64"
        >
          <SearchIcon />
          <span className="flex-1 text-left truncate">Search prompts...</span>
          <kbd className="hidden sm:inline-block text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-zinc-400">⌘K</kbd>
        </button>

        <div className="flex-1" />

        {/* Create button */}
        <Link
          href="/create"
          className="flex items-center gap-1.5 bg-[#0066FF] text-white text-[13px] font-medium px-3 sm:px-3.5 py-1.5 rounded-lg hover:bg-[#0052CC] transition-colors shrink-0 shadow-xs"
        >
          <PlusIcon />
          <span className="hidden sm:inline">Create</span>
        </Link>

        {/* User Auth Info / Logout */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800 shrink-0">
            <span className="hidden sm:inline-block text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-[120px] truncate">
              {user?.name || user?.email}
            </span>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              title="Sign out"
              className="text-xs text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 p-1 transition-colors"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs font-semibold text-[#0066FF] hover:underline px-2 py-1 shrink-0"
          >
            Sign in
          </Link>
        )}
      </header>

      {/* Mobile Drawer / Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-xl z-40 p-4 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200 font-sans">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between",
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                )}
              >
                <span>{link.label}</span>
                {isActive && <span className="size-1.5 rounded-full bg-emerald-500" />}
              </Link>
            );
          })}

          <div className="my-2 h-px bg-zinc-100 dark:bg-zinc-900" />

          {/* Theme Switcher Button for Mobile */}
          <button
            onClick={() => setTheme(nextTheme)}
            className="px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between capitalize"
          >
            <span>Theme: {theme}</span>
            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">Switch</span>
          </button>
        </div>
      )}

      {/* Search command modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-900">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prompts..."
                className="flex-1 text-[14px] bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
              />
              <kbd className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-zinc-400">Esc</kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center text-zinc-400 text-[13px] py-8">No prompts found</p>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-left transition-colors"
                  >
                    <div className="size-7 rounded-md bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-zinc-500">P</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">{p.title}</p>
                      {p.description && (
                        <p className="text-[12px] text-zinc-400 line-clamp-1 mt-0.5">{p.description}</p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-zinc-100 dark:border-zinc-900 px-4 py-2.5 flex items-center gap-4 text-[11px] text-zinc-400">
              <span><kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">↵</kbd> Select</span>
              <span><kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">Esc</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
