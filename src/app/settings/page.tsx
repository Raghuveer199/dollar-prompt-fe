"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { useTheme } from "@/components/theme-provider";
import { PromptStore } from "@/lib/prompt-store";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [resetDone, setResetDone] = useState(false);

  const handleExport = () => {
    const prompts = PromptStore.getPrompts();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(prompts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "dollar_prompt_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    PromptStore.resetStore();
    setResetDone(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="h-full w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col overflow-y-auto font-sans">
      <PageHeader
        title="Settings"
        description="Manage workspace preferences, appearance, and demo data."
      />

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Appearance</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Choose your preferred application theme.</p>
          <div className="flex items-center gap-2">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`text-xs px-4 py-2 rounded-xl font-medium capitalize border transition-all ${
                  theme === t
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Data Section */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Data & Persistence</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Export local workspace data or reset to default seeds.</p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="text-xs border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={handleReset}
              className="text-xs border border-red-200 dark:border-red-950/50 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              {resetDone ? "Resetting..." : "Reset Demo Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
