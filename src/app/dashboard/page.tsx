"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { PromptStore } from "@/lib/prompt-store";
import type { Prompt } from "@/lib/types";

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    setPrompts(PromptStore.getPrompts());
  }, []);

  const totalVersions = prompts.reduce((acc, p) => acc + p.versions.length, 0);
  const avgQuality = prompts.length
    ? Math.round(prompts.reduce((acc, p) => acc + (p.qualityScore || 80), 0) / prompts.length)
    : 0;

  const activeWorkPrompt = prompts[0];

  return (
    <div className="h-full w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col overflow-y-auto font-sans">
      <PageHeader
        title="Dashboard"
        description="Overview of your prompt workspace and ongoing developments."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900">
          <p className="text-xs text-zinc-400 font-medium">Prompts</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{prompts.length}</p>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900">
          <p className="text-xs text-zinc-400 font-medium">Versions</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{totalVersions}</p>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900">
          <p className="text-xs text-zinc-400 font-medium">Improved</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">7</p>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900">
          <p className="text-xs text-zinc-400 font-medium">Avg Quality</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{avgQuality}%</p>
        </div>
      </div>

      {/* Continue Working Card */}
      {activeWorkPrompt && (
        <div className="mb-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              Active Session
            </span>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-2">
              {activeWorkPrompt.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              3 proposed changes waiting for review
            </p>
          </div>
          <Link
            href={`/prompt/${activeWorkPrompt.id}`}
            className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            Continue →
          </Link>
        </div>
      )}

      {/* Recent Prompts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Recent Prompts</h2>
          <Link href="/prompts" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {prompts.slice(0, 4).map((p) => (
            <Link
              href={`/prompt/${p.id}`}
              key={p.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{p.title}</h4>
                <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
                  v{p.currentVersion}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                {p.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
