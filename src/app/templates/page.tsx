"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { TemplateStore } from "@/lib/template-store";
import type { Template } from "@/lib/types";

export default function TemplatesPage() {
  const [category, setCategory] = useState<string>("all");
  const templates = TemplateStore.getTemplates();

  const categories = ["all", "work", "coding", "writing", "research", "marketing"];

  const filtered = category === "all"
    ? templates
    : templates.filter((t) => t.category === category);

  return (
    <div className="h-full w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col overflow-y-auto font-sans">
      <PageHeader
        title="Prompt Templates"
        description="Start with a battle-tested structure and customize it to your needs."
      />

      {/* Category Tabs */}
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-fit shrink-0 mb-6 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
              category === cat
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900 flex flex-col justify-between h-48"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-zinc-900 dark:text-white">{t.title}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 capitalize">
                  {t.category}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3">{t.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <span className="text-[10px] text-zinc-400 font-medium">{t.usageCount} uses</span>
              <Link
                href={`/create?template=${t.id}`}
                className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Use template →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
