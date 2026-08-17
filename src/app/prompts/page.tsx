"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { PromptStore } from "@/lib/prompt-store";
import type { Prompt } from "@/lib/types";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "favorites">("all");

  useEffect(() => {
    setPrompts(PromptStore.getPrompts());
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = prompts.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    setPrompts(updated);
    PromptStore.savePrompts(updated);
  };

  const filtered = prompts
    .filter((p) => (tab === "favorites" ? p.isFavorite : true))
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || (p.description || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col overflow-y-auto font-sans">
      <PageHeader
        title="Your Prompts"
        description="Canonical prompt templates with version control."
        actions={
          <Link
            href="/create"
            className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            + Create Prompt
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setTab("all")}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              tab === "all"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            All Prompts
          </button>
          <button
            onClick={() => setTab("favorites")}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              tab === "favorites"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Favorites
            <svg className="size-3.5 fill-amber-400 text-amber-400" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter prompts..."
          className="text-xs px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white w-full sm:w-64 focus:outline-none"
        />
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <Link
            href={`/prompt/${p.id}`}
            key={p.id}
            className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between h-40"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-zinc-900 dark:text-white">{p.title}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavorite(e, p.id)}
                    className="p-1 hover:scale-110 transition-transform text-zinc-400 hover:text-amber-400"
                    title={p.isFavorite ? "Remove favorite" : "Add favorite"}
                  >
                    <svg
                      className={`size-4 ${p.isFavorite ? "fill-amber-400 text-amber-400" : "fill-none stroke-current"}`}
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </button>
                  <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
                    v{p.currentVersion}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{p.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 text-[10px] text-zinc-400">
              <span>Quality: {p.qualityScore || 80}%</span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Open →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
