"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { PromptStore } from "@/lib/prompt-store";
import { TemplateStore } from "@/lib/template-store";
import type { Prompt } from "@/lib/types";

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

export default function CreatePage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const resolvedParams = use(searchParams);
  const router = useRouter();
  const [createInput, setCreateInput] = useState("");
  const [showDraft, setShowDraft] = useState(false);
  const [draftContent, setDraftContent] = useState(SEED_CUSTOMER_SUPPORT_CONTENT);
  const [draftTitle, setDraftTitle] = useState("Customer Support Agent");

  useEffect(() => {
    if (resolvedParams?.template) {
      const tmpl = TemplateStore.getTemplateById(resolvedParams.template);
      if (tmpl) {
        setCreateInput(tmpl.content);
        setDraftContent(tmpl.content);
        setDraftTitle(tmpl.title);
      }
    }
  }, [resolvedParams]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createInput.trim()) {
      setShowDraft(true);
    }
  };

  const handleStartWorkspace = () => {
    const prompts = PromptStore.getPrompts();
    const newPromptId = `prompt-${Math.random().toString(36).substr(2, 9)}`;
    const newPrompt: Prompt = {
      id: newPromptId,
      title: draftTitle,
      description: "Custom created prompt template.",
      currentVersion: 1,
      versions: [
        {
          number: 1,
          content: draftContent,
          changeSummary: "Initial prompt",
          createdAt: new Date().toLocaleString(),
          createdFrom: createInput,
        },
      ],
      sessions: [
        {
          id: `session-${Math.random().toString(36).substr(2, 9)}`,
          promptId: newPromptId,
          messages: [],
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        },
      ],
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };

    const updatedPrompts = [...prompts, newPrompt];
    PromptStore.savePrompts(updatedPrompts);
    router.push(`/prompt/${newPromptId}`);
  };

  if (showDraft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] py-6 max-w-2xl mx-auto w-full font-sans">
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 w-full">
          <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800 flex items-center justify-between">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{draftTitle}</span>
            <span className="text-xs bg-zinc-100 px-2 py-0.5 rounded text-zinc-500 font-medium dark:bg-zinc-800 dark:text-zinc-400">v1 · Draft</span>
          </div>

          <div className="p-8 max-h-[350px] overflow-y-auto border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-955/20">
            <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-300">
              {draftContent}
            </pre>
          </div>

          <div className="p-6 flex justify-between items-center bg-white dark:bg-zinc-900">
            <button
              onClick={() => setShowDraft(false)}
              className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors dark:text-zinc-400"
            >
              Keep refining
            </button>
            <button
              onClick={handleStartWorkspace}
              className="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
            >
              Start using this
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Create a new prompt
        </h1>
        <p className="text-zinc-400 text-xs mt-1 font-medium">What do you want AI to help you do?</p>
      </div>

      <form onSubmit={handleCreateSubmit} className="w-full">
        <div className="border border-zinc-200 rounded-2xl shadow-sm bg-white p-3 flex flex-col dark:bg-zinc-900 dark:border-zinc-800">
          <textarea
            value={createInput}
            onChange={(e) => setCreateInput(e.target.value)}
            placeholder="I need a prompt for..."
            className="w-full min-h-[140px] p-3 text-[14px] resize-none focus:outline-none bg-transparent text-zinc-900 dark:text-zinc-100"
          />
          <div className="flex items-center justify-between border-t border-zinc-100 pt-3 px-2 dark:border-zinc-800">
            <span className="text-xs text-zinc-400 font-medium">Creation Mode: Standard</span>
            <button
              type="submit"
              disabled={!createInput.trim()}
              className="bg-zinc-900 text-white text-xs px-4 py-2 rounded-xl hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 font-semibold transition-opacity"
            >
              Create draft →
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center mt-6">
        {["Customer support", "Code reviewer", "Writing assistant", "Data analyst"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() =>
              setCreateInput(
                tag === "Customer support"
                  ? "I need a customer support agent that handles refund questions."
                  : `I need a prompt for a ${tag.toLowerCase()}...`
              )
            }
            className="text-xs border border-zinc-200 rounded-full px-3.5 py-1.5 hover:bg-zinc-50 text-zinc-600 transition-colors dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
