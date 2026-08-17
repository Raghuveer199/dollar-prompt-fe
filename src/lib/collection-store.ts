"use client";

import type { Collection } from "./types";

const STORAGE_KEY = "dollar_prompt_collections";

const SEED_COLLECTIONS: Collection[] = [
  {
    id: "col-customer-support",
    name: "Customer Support",
    description: "Prompts for handling customer queries, refunds, and escalations.",
    icon: "message-square",
    color: "bg-blue-50 dark:bg-blue-950/30",
    promptIds: ["prompt-cust-support"],
    createdAt: new Date(Date.now() - 7 * 86400000).toLocaleString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toLocaleString(),
  },
  {
    id: "col-engineering",
    name: "Engineering",
    description: "Code review, architecture, and technical documentation prompts.",
    icon: "code-2",
    color: "bg-violet-50 dark:bg-violet-950/30",
    promptIds: ["prompt-code-reviewer"],
    createdAt: new Date(Date.now() - 14 * 86400000).toLocaleString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toLocaleString(),
  },
  {
    id: "col-writing",
    name: "Writing",
    description: "Copy editing, content creation, and communication prompts.",
    icon: "pen-tool",
    color: "bg-amber-50 dark:bg-amber-950/30",
    promptIds: ["prompt-writing-assistant"],
    createdAt: new Date(Date.now() - 10 * 86400000).toLocaleString(),
    updatedAt: new Date(Date.now() - 1 * 3600000).toLocaleString(),
  },
  {
    id: "col-marketing",
    name: "Marketing",
    description: "Campaign copy, social media, and brand voice prompts.",
    icon: "megaphone",
    color: "bg-rose-50 dark:bg-rose-950/30",
    promptIds: [],
    createdAt: new Date(Date.now() - 5 * 86400000).toLocaleString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toLocaleString(),
  },
  {
    id: "col-research",
    name: "Research",
    description: "Literature review, summarization, and analysis prompts.",
    icon: "search",
    color: "bg-emerald-50 dark:bg-emerald-950/30",
    promptIds: [],
    createdAt: new Date(Date.now() - 3 * 86400000).toLocaleString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toLocaleString(),
  },
];

export const CollectionStore = {
  getCollections(): Collection[] {
    if (typeof window === "undefined") return SEED_COLLECTIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_COLLECTIONS));
      return SEED_COLLECTIONS;
    } catch {
      return SEED_COLLECTIONS;
    }
  },

  saveCollections(collections: Collection[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    } catch {
      // ignore
    }
  },

  resetStore(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_COLLECTIONS));
    } catch {
      // ignore
    }
  },
};
