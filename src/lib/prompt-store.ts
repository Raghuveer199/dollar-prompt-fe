"use client";

import type { Prompt, Version, Session } from "@/lib/types";

const LOCAL_STORAGE_KEY = "dollar_prompt_prompts";

const SEED_CUSTOMER_SUPPORT_CONTENT = `You are a professional customer support agent for Dollar Prompt. Your primary responsibility is handling customer refund requests in a polite, helpful, and clear manner.

REFUND INSTRUCTIONS AND RULES:
1. Customers are eligible for a full refund within 30 days of purchase if they have not used more than 10 credits.
2. If they purchased within 30 days but used more than 10 credits, they are eligible for a 50% partial refund.
3. If the purchase was made more than 30 days ago, refunds are strictly not allowed.
4. Always explain the decision clearly, reference their specific credit usage, and remain professional.

When handling a query:
- First, greet the customer warmly.
- Check their account purchase date and credit usage records.
- Apply the rules above to calculate refund eligibility.
- Write a concise response stating the decision and next steps.`;

const SEED_CODE_REVIEWER_CONTENT = `You are an expert senior developer who conducts thorough, constructive code reviews.

Key responsibilities:
1. Check for correctness and potential runtime exceptions.
2. Review security issues (e.g. input sanitization, data leaks).
3. Ensure efficient algorithms and memory usage.
4. Provide refactoring suggestions with code examples.

Always structure your feedback clearly with issues categorized by severity (Critical, Major, Minor).`;

const SEED_WRITING_ASSISTANT_CONTENT = `You are a highly skilled copy editor and writing coach.

Your goals are to improve:
- Clarity and conciseness
- Flow and transition
- Vocabulary and style
- Grammatical correctness

Do not rewrite entire paragraphs; instead, point out areas of improvement and show side-by-side examples.`;

const SEED_DATA: Prompt[] = [
  {
    id: "prompt-cust-support",
    title: "Customer Support Agent",
    description: "Handles customer refund questions and credit usage calculations.",
    currentVersion: 1,
    versions: [
      {
        number: 1,
        content: SEED_CUSTOMER_SUPPORT_CONTENT,
        changeSummary: "Initial prompt",
        createdAt: new Date(Date.now() - 8 * 60000).toLocaleString(),
        createdFrom: "I need a customer support agent that handles refund questions.",
      },
    ],
    sessions: [],
    isFavorite: true,
    collectionIds: ["col-customer-support"],
    tags: ["support", "refunds"],
    usageCount: 47,
    qualityScore: 84,
    createdAt: new Date(Date.now() - 8 * 60000).toLocaleString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toLocaleString(),
  },
  {
    id: "prompt-code-reviewer",
    title: "Code Reviewer",
    description: "Reviews code blocks for bugs, efficiency, and compliance.",
    currentVersion: 1,
    versions: [
      {
        number: 1,
        content: SEED_CODE_REVIEWER_CONTENT,
        changeSummary: "Initial prompt",
        createdAt: new Date(Date.now() - 24 * 3600000).toLocaleString(),
        createdFrom: "I need a senior developer prompt that conducts code reviews.",
      },
    ],
    sessions: [],
    isFavorite: false,
    collectionIds: ["col-engineering"],
    tags: ["code", "review"],
    usageCount: 23,
    qualityScore: 76,
    createdAt: new Date(Date.now() - 24 * 3600000).toLocaleString(),
    updatedAt: new Date(Date.now() - 86400000).toLocaleString(),
  },
  {
    id: "prompt-writing-assistant",
    title: "Writing Assistant",
    description: "Refines text structure, vocabulary, and flow with line recommendations.",
    currentVersion: 1,
    versions: [
      {
        number: 1,
        content: SEED_WRITING_ASSISTANT_CONTENT,
        changeSummary: "Initial prompt",
        createdAt: new Date(Date.now() - 72 * 3600000).toLocaleString(),
        createdFrom: "I need an editor prompt that helps coach my writing.",
      },
    ],
    sessions: [],
    isFavorite: true,
    collectionIds: ["col-writing"],
    tags: ["writing", "editing"],
    usageCount: 31,
    qualityScore: 71,
    createdAt: new Date(Date.now() - 72 * 3600000).toLocaleString(),
    updatedAt: new Date(Date.now() - 3600000).toLocaleString(),
  },
];

export const PromptStore = {
  getPrompts(): Prompt[] {
    if (typeof window === "undefined") return SEED_DATA;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    } catch {
      return SEED_DATA;
    }
  },

  createPrompt(data: { title: string; category?: string; initialContent: string; tags?: string[] }): Prompt {
    const prompts = this.getPrompts();
    const id = `prompt-${Math.random().toString(36).substring(2, 9)}`;
    const newPrompt: Prompt = {
      id,
      title: data.title,
      description: `Custom ${data.category || "General"} prompt.`,
      currentVersion: 1,
      versions: [
        {
          number: 1,
          content: data.initialContent,
          changeSummary: "Initial draft",
          createdAt: new Date().toLocaleString(),
          createdFrom: data.initialContent,
        },
      ],
      sessions: [
        {
          id: `session-${Math.random().toString(36).substring(2, 9)}`,
          promptId: id,
          messages: [],
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        },
      ],
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      tags: data.tags || ["draft"],
    };
    this.savePrompts([...prompts, newPrompt]);
    return newPrompt;
  },

  savePrompts(prompts: Prompt[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prompts));
    } catch { /* ignore */ }
  },

  resetStore(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_DATA));
    } catch { /* ignore */ }
  },
};

// Re-export types for backward compatibility with prompt-studio.tsx
export type { Prompt, Version, Session };
