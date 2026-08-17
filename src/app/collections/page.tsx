"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { CollectionStore } from "@/lib/collection-store";
import type { Collection } from "@/lib/types";

const getCollectionIcon = (iconName: string) => {
  switch (iconName) {
    case "message-square":
      return (
        <svg className="size-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      );
    case "code-2":
      return (
        <svg className="size-6 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>
        </svg>
      );
    case "pen-tool":
      return (
        <svg className="size-6 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18"/><path d="m2 2 7.5 7.5"/>
        </svg>
      );
    case "megaphone":
      return (
        <svg className="size-6 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
        </svg>
      );
    case "search":
      return (
        <svg className="size-6 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      );
    default:
      return null;
  }
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    setCollections(CollectionStore.getCollections());
  }, []);

  return (
    <div className="h-full w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col overflow-y-auto font-sans">
      <PageHeader
        title="Collections"
        description="Organize prompts by work domains and functional teams."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        {collections.map((col) => (
          <Link
            href={`/collections/${col.id}`}
            key={col.id}
            className={`border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between h-44`}
          >
            <div>
              <div className="mb-3">{getCollectionIcon(col.icon)}</div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">{col.name}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                {col.description}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 text-[10px] text-zinc-400">
              <span>{col.promptIds.length} prompts</span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">View →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
