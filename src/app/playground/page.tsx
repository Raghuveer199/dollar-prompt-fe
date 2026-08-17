"use client";

import React, { useEffect, useState, use } from "react";
import { PageHeader } from "@/components/common/page-header";
import { PromptStore } from "@/lib/prompt-store";
import { PlaygroundStore } from "@/lib/playground-store";
import type { Prompt } from "@/lib/types";

export default function PlaygroundPage({ searchParams }: { searchParams: Promise<{ prompt?: string }> }) {
  const resolvedParams = use(searchParams);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string>("");
  const [testInput, setTestInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const list = PromptStore.getPrompts();
    setPrompts(list);
    if (resolvedParams?.prompt) {
      setSelectedPromptId(resolvedParams.prompt);
    } else if (list.length > 0) {
      setSelectedPromptId(list[0].id);
    }
  }, [resolvedParams]);

  const activePrompt = prompts.find((p) => p.id === selectedPromptId);

  const handleRun = () => {
    if (!testInput.trim()) return;
    setIsRunning(true);
    setOutput("");

    const fullResponse = PlaygroundStore.getMockOutput(testInput);
    let index = 0;

    const timer = setInterval(() => {
      if (index < fullResponse.length) {
        setOutput(fullResponse.slice(0, index + 4));
        index += 4;
      } else {
        setOutput(fullResponse);
        setIsRunning(false);
        clearInterval(timer);
      }
    }, 20);
  };

  return (
    <div className="h-full w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col overflow-y-auto font-sans">
      <PageHeader
        title="Prompt Playground"
        description="Test prompt variations with sample inputs before committing to new versions."
      />

      <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Column: Prompt Selection & Config */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Select Prompt</label>
            <select
              value={selectedPromptId}
              onChange={(e) => setSelectedPromptId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none"
            >
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (v{p.currentVersion})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col min-h-[200px]">
            <label className="text-xs font-medium text-zinc-500 block mb-1">Active Version Text</label>
            <div className="flex-1 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs font-mono whitespace-pre-wrap overflow-y-auto text-zinc-700 dark:text-zinc-300">
              {activePrompt?.versions[activePrompt.versions.length - 1]?.content || "No prompt selected."}
            </div>
          </div>
        </div>

        {/* Right Column: Input & Output */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Test Input</label>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter a customer query, code snippet, or text to test..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning || !testInput.trim()}
            className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {isRunning ? "Running test..." : "Run Test →"}
          </button>

          <div className="flex-1 flex flex-col min-h-[200px]">
            <label className="text-xs font-medium text-zinc-500 block mb-1">Output</label>
            <div className="flex-1 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs font-sans whitespace-pre-wrap overflow-y-auto leading-relaxed text-zinc-800 dark:text-zinc-200">
              {output || (
                <span className="text-zinc-400 italic">Click &quot;Run Test&quot; to generate an output.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
