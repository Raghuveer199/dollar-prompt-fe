"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { PromptStore } from "@/lib/prompt-store";
import type { Prompt } from "@/lib/types";

export default function InsightsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    setPrompts(PromptStore.getPrompts());
  }, []);

  return (
    <div className="h-full w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col overflow-y-auto font-sans">
      <PageHeader
        title="Prompt Insights"
        description="Analytics on prompt performance, version iterations, and usage patterns."
      />

      {/* Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900">
          <p className="text-xs text-zinc-400 font-medium">Most Used</p>
          <h4 className="text-base font-semibold text-zinc-900 dark:text-white mt-1">Customer Support Agent</h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">47 execution runs</p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900">
          <p className="text-xs text-zinc-400 font-medium">Highest Quality</p>
          <h4 className="text-base font-semibold text-zinc-900 dark:text-white mt-1">Customer Support Agent</h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">84/100 score</p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900">
          <p className="text-xs text-zinc-400 font-medium">Active Versions</p>
          <h4 className="text-base font-semibold text-zinc-900 dark:text-white mt-1">3 Canonical Prompts</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">100% up to date</p>
        </div>
      </div>

      {/* Usage Activity List */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Prompt Activity Distribution</h3>
        <div className="space-y-4">
          {prompts.map((p) => {
            const usage = p.usageCount || 20;
            const pct = Math.min(100, Math.round((usage / 50) * 100));
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{p.title}</span>
                  <span className="text-zinc-400 font-mono">{usage} runs</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
