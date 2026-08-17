"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { CollectionStore } from "@/lib/collection-store";
import { PromptStore } from "@/lib/prompt-store";
import type { Collection, Prompt } from "@/lib/types";

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    params.then((p) => {
      const cols = CollectionStore.getCollections();
      const col = cols.find((c) => c.id === p.id);
      if (col) {
        setCollection(col);
        const allPrompts = PromptStore.getPrompts();
        setPrompts(allPrompts.filter((pr) => col.promptIds.includes(pr.id)));
      }
    });
  }, [params]);

  if (!collection) {
    return (
      <div className="p-8 text-xs text-zinc-400">Loading collection...</div>
    );
  }

  return (
    <div className="h-full w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col overflow-y-auto font-sans">
      <PageHeader
        title={collection.name}
        description={collection.description}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {prompts.length === 0 ? (
          <p className="text-xs text-zinc-400 py-8">No prompts assigned to this collection yet.</p>
        ) : (
          prompts.map((p) => (
            <Link
              href={`/prompt/${p.id}`}
              key={p.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between h-36"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white">{p.title}</span>
                  <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                    v{p.currentVersion}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{p.description}</p>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2 text-[10px] text-zinc-400">
                Quality: {p.qualityScore || 80}%
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
