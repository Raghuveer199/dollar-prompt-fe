"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PromptStore } from "@/lib/prompt-store";
import { cn } from "@/lib/utils";

import type { Prompt, Version, Session, Message, Proposal, ProposedChange } from "@/lib/types";
export type { Prompt, Version, Session, Message, Proposal, ProposedChange };


// Initial semantic blocks for Customer Support Agent
const ORIGINAL_BLOCKS = [
  `You are a professional customer support agent for Dollar Prompt. Your primary responsibility is handling customer refund requests in a polite, helpful, and clear manner.`,
  `REFUND INSTRUCTIONS AND RULES:
1. Customers are eligible for a full refund within 30 days of purchase if they have not used more than 10 credits.
2. If they purchased within 30 days but used more than 10 credits, they are eligible for a 50% partial refund.
3. If the purchase was made more than 30 days ago, refunds are strictly not allowed.
4. Always explain the decision clearly, reference their specific credit usage, and remain professional.`,
  `When handling a query:
- First, greet the customer warmly.
- Check their account purchase date and credit usage records.
- Apply the rules above to calculate refund eligibility.
- Write a concise response stating the decision and next steps.`
];

const SEED_CUSTOMER_SUPPORT_CONTENT = ORIGINAL_BLOCKS.join("\n\n");

// Proposed changes values
const PROPOSED_BLOCKS = [
  `You are a customer support agent. Help customers with refund requests professionally and clearly.`,
  `REFUND RULES:
1. Full refund: within 30 days and < 10 credits used.
2. Partial refund (50%): within 30 days and >= 10 credits used.
3. No refund: > 30 days.
Always explain decisions clearly.`,
  `Flow: Greet -> Verify date/credits -> Apply rules -> Respond concisely. Escalate unresolved disputes to Tier-2 team.`
];

// Refined values
const PROPOSED_BLOCKS_REFINED = [
  `You are a customer support agent. Help customers with refund requests professionally and clearly.`,
  `REFUND INSTRUCTIONS AND RULES:
1. Customers are eligible for a full refund within 30 days of purchase if they have not used more than 10 credits.
2. If they purchased within 30 days but used more than 10 credits, they are eligible for a 50% partial refund.
3. If the purchase was made more than 30 days ago, refunds are strictly not allowed.
Always explain the decision clearly and reference credit usage.`,
  `Flow: Greet -> Verify date/credits -> Apply rules -> Respond concisely. Escalate unresolved disputes to Tier-2 team.`
];

// Tone reference values (Source: v1)
const PROPOSED_BLOCKS_TONE_V1 = [
  `You are a professional customer support agent for Dollar Prompt. Your primary responsibility is handling customer refund requests in a polite, helpful, and clear manner.`,
  `REFUND RULES:
1. Full refund: within 30 days and < 10 credits used.
2. Partial refund (50%): within 30 days and >= 10 credits used.
3. No refund: > 30 days.
Always explain decisions clearly.`,
  `Flow: Greet -> Verify date/credits -> Apply rules -> Respond concisely. Escalate unresolved disputes to Tier-2 team.`
];

// 1. PROMPT LIBRARY COMPONENT
export function PromptLibrary() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    setPrompts(PromptStore.getPrompts());
  }, []);

  return (
    <div className="h-full max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-955 dark:text-white">
            Your prompts
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Persistent templates with canonical versions.
          </p>
        </div>
        <Link
          href="/create"
          className="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded-xl hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold font-sans"
        >
          Create prompt
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto grid gap-4 sm:grid-cols-2 pr-1 min-h-0 pb-6">
        {prompts.map((p) => {
          const latestVer = p.versions[p.versions.length - 1];
          return (
            <Link
              href={`/prompt/${p.id}`}
              key={p.id}
              className="border border-zinc-200 rounded-2xl p-5 bg-white hover:border-zinc-355 dark:bg-zinc-900 dark:border-zinc-855 dark:hover:border-zinc-700 cursor-pointer shadow-xs flex flex-col justify-between transition-colors h-[160px] text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-[14px] text-zinc-900 dark:text-zinc-100">
                    {p.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded text-zinc-550 dark:bg-zinc-800 dark:text-zinc-400">
                    v{p.currentVersion}
                  </span>
                </div>
                <p className="text-[12px] text-zinc-400 leading-normal line-clamp-2">
                  {p.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 pt-3 mt-3 dark:border-zinc-800 text-[10px] text-zinc-400 font-medium">
                <span>Updated: {latestVer?.createdAt || p.updatedAt}</span>
                <span className="text-zinc-650 hover:underline dark:text-zinc-300 font-semibold">Open →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// 3. CREATE PROMPT COMPONENT
export function CreatePrompt() {
  const router = useRouter();
  const [createInput, setCreateInput] = useState("");
  const [showDraft, setShowDraft] = useState(false);

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
      title: "Customer Support Agent",
      description: "Handles customer refund questions and credit usage calculations.",
      currentVersion: 1,
      versions: [
        {
          number: 1,
          content: SEED_CUSTOMER_SUPPORT_CONTENT,
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
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Customer Support Agent</span>
            <span className="text-xs bg-zinc-100 px-2 py-0.5 rounded text-zinc-500 font-medium dark:bg-zinc-800 dark:text-zinc-400">v1 · Draft</span>
          </div>

          <div className="p-8 max-h-[350px] overflow-y-auto border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-955/20">
            <pre className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-zinc-855 dark:text-zinc-300">
              {SEED_CUSTOMER_SUPPORT_CONTENT}
            </pre>
          </div>

          <div className="p-6 flex justify-between items-center bg-white dark:bg-zinc-900">
            <button
              onClick={() => setShowDraft(false)}
              className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors dark:text-zinc-400 dark:hover:text-zinc-350"
            >
              Keep refining
            </button>
            <button
              onClick={handleStartWorkspace}
              className="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold"
            >
              Start using this
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-955 dark:text-white">
          Prompt Studio
        </h1>
        <p className="text-zinc-400 text-xs mt-1 font-medium">Develop your prompt artifact.</p>
      </div>

      <form onSubmit={handleCreateSubmit} className="w-full">
        <div className="border border-zinc-200 rounded-2xl shadow-sm bg-white p-2 flex flex-col dark:bg-zinc-900 dark:border-zinc-800">
          <textarea
            value={createInput}
            onChange={(e) => setCreateInput(e.target.value)}
            placeholder="I need a prompt for..."
            className="w-full min-h-[120px] p-3 text-[14.5px] resize-none focus:outline-none bg-transparent text-zinc-900 dark:text-zinc-100"
          />
          <div className="flex items-center justify-between border-t border-zinc-100 p-2 dark:border-zinc-800">
            <span className="text-xs text-zinc-400">Creation Mode</span>
            <button
              type="submit"
              disabled={!createInput.trim()}
              className="bg-zinc-900 text-white text-xs px-4 py-2 rounded-xl hover:bg-zinc-855 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold"
            >
              Create draft
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
            className="text-xs border border-zinc-200 rounded-full px-3.5 py-1.5 hover:bg-zinc-55 text-zinc-555 transition-colors dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

// 4. PROMPT WORKSPACE DEVELOPMENT COMPONENT
export function PromptWorkspace({ promptId }: { promptId: string }) {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  // UI Local Workspace states
  const [chatInput, setChatInput] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [viewingHistoryVersion, setViewingHistoryVersion] = useState<Version | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const [activeChangeIndex, setActiveChangeIndex] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sync prompts on load
  useEffect(() => {
    setPrompts(PromptStore.getPrompts());
  }, []);

  const activePrompt = prompts.find((p) => p.id === promptId);

  // Auto seed session if none exists
  useEffect(() => {
    if (activePrompt && activePrompt.sessions.length === 0) {
      const updatedPrompt = {
        ...activePrompt,
        sessions: [
          {
            id: `session-${Math.random().toString(36).substr(2, 9)}`,
            promptId: activePrompt.id,
            messages: [],
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),
          },
        ],
      };
      const updatedPrompts = prompts.map((p) => (p.id === activePrompt.id ? updatedPrompt : p));
      setPrompts(updatedPrompts);
      PromptStore.savePrompts(updatedPrompts);
    }
  }, [activePrompt, prompts]);

  const activeSession = activePrompt?.sessions[0];
  const activeProposal = activeSession?.messages.find(
    (m) => m.type === "proposal" && m.proposal?.status === "pending"
  )?.proposal || null;

  // Auto scroll into view focused inline element
  useEffect(() => {
    if (activeProposal && blockRefs.current[activeChangeIndex]) {
      blockRefs.current[activeChangeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeChangeIndex, activeProposal]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, activeProposal]);

  if (!activePrompt || !activeSession) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-zinc-500 font-medium text-xs">Loading prompt workspace...</span>
      </div>
    );
  }

  // Helper: Assemble prompt text from selected change groups
  const assemblePromptText = (changes: ProposedChange[]) => {
    const b1 = changes[0].status === "rejected" ? ORIGINAL_BLOCKS[0] : (changes[0].status === "accepted" ? PROPOSED_BLOCKS[0] : ORIGINAL_BLOCKS[0]);
    const b2 = changes[1].status === "rejected" ? ORIGINAL_BLOCKS[1] : (changes[1].status === "accepted" ? PROPOSED_BLOCKS[1] : ORIGINAL_BLOCKS[1]);
    const b3 = changes[2].status === "rejected" ? ORIGINAL_BLOCKS[2] : (changes[2].status === "accepted" ? PROPOSED_BLOCKS[2] : ORIGINAL_BLOCKS[2]);
    return `${b1}\n\n${b2}\n\n${b3}`;
  };

  // Specific multi-change mapping for Tone v1 reference
  const assembleTonePromptText = (changes: ProposedChange[]) => {
    const b1 = changes[0].status === "rejected" ? ORIGINAL_BLOCKS[0] : PROPOSED_BLOCKS_TONE_V1[0];
    const b2 = changes[1].status === "rejected" ? ORIGINAL_BLOCKS[1] : PROPOSED_BLOCKS_TONE_V1[1];
    const b3 = changes[2].status === "rejected" ? ORIGINAL_BLOCKS[2] : PROPOSED_BLOCKS_TONE_V1[2];
    return `${b1}\n\n${b2}\n\n${b3}`;
  };

  const handleToggleChangeStatus = (changeId: string, status: "accepted" | "rejected") => {
    if (!activeProposal) return;

    const updatedChanges = activeProposal.changes.map((c) =>
      c.id === changeId ? { ...c, status } : c
    );

    const updatedProposal: Proposal = {
      ...activeProposal,
      changes: updatedChanges,
    };

    const updatedMessages = activeSession.messages.map((m) => {
      if (m.type === "proposal" && m.proposal?.id === activeProposal.id) {
        return { ...m, proposal: updatedProposal };
      }
      return m;
    });

    const updatedPrompt: Prompt = {
      ...activePrompt,
      sessions: [
        {
          ...activeSession,
          messages: updatedMessages,
          updatedAt: new Date().toLocaleString(),
        },
      ],
      updatedAt: new Date().toLocaleString(),
    };

    const updatedPrompts = prompts.map((p) => (p.id === activePrompt.id ? updatedPrompt : p));
    setPrompts(updatedPrompts);
    PromptStore.savePrompts(updatedPrompts);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    // Append user message
    const userMsgId = Math.random().toString();
    const userMessage: Message = { id: userMsgId, sender: "user", text: query, type: "plain" };
    const updatedMessagesWithUser = [...activeSession.messages, userMessage];

    // Mock Intent matching
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let responseMessage: Message;

      // Scenario 1: Make this less verbose
      if (lowerQuery.includes("less verbose") || lowerQuery.includes("shorter") || lowerQuery.includes("concise")) {
        const changes: ProposedChange[] = [
          {
            id: "ch-tone",
            section: "Tone",
            before: ORIGINAL_BLOCKS[0],
            after: PROPOSED_BLOCKS[0],
            summary: "Made the tone more welcoming.",
            status: "pending",
          },
          {
            id: "ch-refund",
            section: "Refund instructions",
            before: ORIGINAL_BLOCKS[1],
            after: PROPOSED_BLOCKS[1],
            summary: "Shortened instructions from 142 → 61 words.",
            status: "pending",
          },
          {
            id: "ch-escalation",
            section: "Escalation rules",
            before: ORIGINAL_BLOCKS[2],
            after: PROPOSED_BLOCKS[2],
            summary: "Clarified escalation flow for unresolved disputes.",
            status: "pending",
          },
        ];

        const proposal: Proposal = {
          id: `proposal-${Math.random().toString(36).substr(2, 9)}`,
          baseVersion: activePrompt.currentVersion,
          changes: changes,
          summary: "Made the prompt shorter and friendlier.",
          status: "pending",
        };

        responseMessage = {
          id: Math.random().toString(),
          sender: "assistant",
          text: "I shortened the introduction and refund instructions while keeping the refund rules intact.",
          type: "proposal",
          proposal: proposal,
        };
        setActiveChangeIndex(0);
      }
      // Scenario 2 (Refinement): Keep A, reject C
      else if (
        activeProposal &&
        activeProposal.status === "pending" &&
        lowerQuery.includes("keep the shorter instructions") &&
        lowerQuery.includes("don't remove")
      ) {
        const refinedChanges = activeProposal.changes.map((c) => {
          if (c.section === "Refund instructions") return { ...c, status: "accepted" as const };
          if (c.section === "Escalation rules") return { ...c, status: "rejected" as const };
          return c;
        });

        const refinedProp: Proposal = {
          ...activeProposal,
          changes: refinedChanges,
          summary: "Refined proposal: kept short refund instructions, preserved original escalation rules.",
        };

        const messagesWithRefined = updatedMessagesWithUser.map((m) => {
          if (m.type === "proposal" && m.proposal?.id === activeProposal.id) {
            return { ...m, proposal: refinedProp };
          }
          return m;
        });

        const updatedPrompt: Prompt = {
          ...activePrompt,
          sessions: [
            {
              ...activeSession,
              messages: messagesWithRefined,
              updatedAt: new Date().toLocaleString(),
            },
          ],
          updatedAt: new Date().toLocaleString(),
        };

        const updatedPrompts = prompts.map((p) => (p.id === activePrompt.id ? updatedPrompt : p));
        setPrompts(updatedPrompts);
        PromptStore.savePrompts(updatedPrompts);
        return;
      }
      // Scenario 3: Ask questions (PlainResponse)
      else if (lowerQuery.includes("twice") || lowerQuery.includes("why") || lowerQuery.includes("mention refunds")) {
        responseMessage = {
          id: Math.random().toString(),
          sender: "assistant",
          text: "The prompt mentions refunds in two places:\n\n• **Refund Rules Section**: Defines duration and credit calculation constraints.\n• **Query Handling Sequence**: Outlines greeting, rule calculation, and response creation.\n\nThey serve different purposes, but we could combine them if desired.",
          type: "plain",
        };
      }
      // Scenario 4: Cross-version Tone
      else if (lowerQuery.includes("tone from v1") || lowerQuery.includes("v1 tone") || lowerQuery.includes("mix v1")) {
        const changes: ProposedChange[] = [
          {
            id: "ch-tone-v1",
            section: "Tone",
            before: PROPOSED_BLOCKS[0],
            after: PROPOSED_BLOCKS_TONE_V1[0],
            summary: "Restored friendly professional tone from v1.",
            status: "pending",
          },
          {
            id: "ch-refund-v1",
            section: "Refund instructions",
            before: PROPOSED_BLOCKS[1],
            after: PROPOSED_BLOCKS_TONE_V1[1],
            summary: "Preserved current v2 concise rules.",
            status: "pending",
          },
          {
            id: "ch-escalation-v1",
            section: "Escalation rules",
            before: PROPOSED_BLOCKS[2],
            after: PROPOSED_BLOCKS_TONE_V1[2],
            summary: "Preserved current v2 escalation rules.",
            status: "pending",
          },
        ];

        const proposal: Proposal = {
          id: `proposal-tone-${Math.random().toString(36).substr(2, 9)}`,
          baseVersion: activePrompt.currentVersion,
          changes: changes,
          summary: "Adjusted the tone to match v1.",
          status: "pending",
          sourceVersions: [1],
        };

        responseMessage = {
          id: Math.random().toString(),
          sender: "assistant",
          text: "I updated the suggested changes to preserve the refund rules and keep the friendlier tone.",
          type: "proposal",
          proposal: proposal,
        };
        setActiveChangeIndex(0);
      }
      // Fallback
      else {
        responseMessage = {
          id: Math.random().toString(),
          sender: "assistant",
          text: `I'm a prototype of Dollar Prompt. Try typing:
• "Make this less verbose." (to generate 3 changes)
• "Keep the shorter instructions, but don't remove the refund rules." (to refine them)
• "Why does it mention refunds twice?" (for plain explanation)
• "Take the tone from v1 but keep everything else from the current version." (for cross-version references)`,
          type: "plain",
        };
      }

      const updatedPrompt: Prompt = {
        ...activePrompt,
        sessions: [
          {
            ...activeSession,
            messages: [...updatedMessagesWithUser, responseMessage],
            updatedAt: new Date().toLocaleString(),
          },
        ],
        updatedAt: new Date().toLocaleString(),
      };

      const updatedPrompts = prompts.map((p) => (p.id === activePrompt.id ? updatedPrompt : p));
      setPrompts(updatedPrompts);
      PromptStore.savePrompts(updatedPrompts);
    }, 400);

    const updatedPromptWithUserMessage: Prompt = {
      ...activePrompt,
      sessions: [
        {
          ...activeSession,
          messages: updatedMessagesWithUser,
          updatedAt: new Date().toLocaleString(),
        },
      ],
      updatedAt: new Date().toLocaleString(),
    };

    const updatedPrompts = prompts.map((p) => (p.id === activePrompt.id ? updatedPromptWithUserMessage : p));
    setPrompts(updatedPrompts);
    PromptStore.savePrompts(updatedPrompts);
    setChatInput("");
  };

  const handleApplyProposal = () => {
    if (!activePrompt || !activeSession || !activeProposal) return;

    const nextVer = activePrompt.currentVersion + 1;
    const finalChanges = activeProposal.changes.map((c) =>
      c.status === "pending" ? { ...c, status: "accepted" as const } : c
    );

    const finalContent = activeProposal.sourceVersions && activeProposal.sourceVersions.includes(1)
      ? assembleTonePromptText(finalChanges)
      : assemblePromptText(finalChanges);

    const acceptedSummary = finalChanges
      .filter((c) => c.status === "accepted")
      .map((c) => c.section.toLowerCase())
      .join(" and ");

    const newVersion: Version = {
      number: nextVer,
      content: finalContent,
      changeSummary: acceptedSummary ? `Applied improvements to ${acceptedSummary}.` : "Applied revisions.",
      createdAt: new Date().toLocaleString(),
      createdFrom: activeProposal.summary,
    };

    const updatedVersions = [...activePrompt.versions, newVersion];

    const updatedMessages = activeSession.messages.map((m) => {
      if (m.type === "proposal" && m.proposal?.id === activeProposal.id) {
        return {
          ...m,
          proposal: {
            ...m.proposal!,
            status: "applied" as const,
            changes: finalChanges,
          },
        };
      }
      return m;
    });

    const updatedPrompt: Prompt = {
      ...activePrompt,
      currentVersion: nextVer,
      versions: updatedVersions,
      sessions: [
        {
          ...activeSession,
          messages: updatedMessages,
          updatedAt: new Date().toLocaleString(),
        },
      ],
      updatedAt: new Date().toLocaleString(),
    };

    const updatedPrompts = prompts.map((p) => (p.id === activePrompt.id ? updatedPrompt : p));
    setPrompts(updatedPrompts);
    PromptStore.savePrompts(updatedPrompts);
  };

  const handleDiscardProposal = () => {
    if (!activePrompt || !activeSession || !activeProposal) return;

    const updatedMessages = activeSession.messages.map((m) => {
      if (m.type === "proposal" && m.proposal?.id === activeProposal.id) {
        return {
          ...m,
          proposal: {
            ...m.proposal!,
            status: "discarded" as const,
          },
        };
      }
      return m;
    });

    const updatedPrompt: Prompt = {
      ...activePrompt,
      sessions: [
        {
          ...activeSession,
          messages: updatedMessages,
          updatedAt: new Date().toLocaleString(),
        },
      ],
      updatedAt: new Date().toLocaleString(),
    };

    const updatedPrompts = prompts.map((p) => (p.id === activePrompt.id ? updatedPrompt : p));
    setPrompts(updatedPrompts);
    PromptStore.savePrompts(updatedPrompts);
  };

  const handleRestoreVersion = () => {
    if (!viewingHistoryVersion) return;

    const nextVer = activePrompt.currentVersion + 1;
    const restoredVersion: Version = {
      number: nextVer,
      content: viewingHistoryVersion.content,
      changeSummary: `Restored v${viewingHistoryVersion.number}`,
      createdAt: new Date().toLocaleString(),
      createdFrom: `Restored version ${viewingHistoryVersion.number}`,
    };

    const updatedPrompt: Prompt = {
      ...activePrompt,
      currentVersion: nextVer,
      versions: [...activePrompt.versions, restoredVersion],
      updatedAt: new Date().toLocaleString(),
    };

    const updatedPrompts = prompts.map((p) => (p.id === activePrompt.id ? updatedPrompt : p));
    setPrompts(updatedPrompts);
    PromptStore.savePrompts(updatedPrompts);

    setViewingHistoryVersion(null);
    setShowRestoreConfirm(false);
    setIsHistoryOpen(false);
  };

  const handleAcceptAllChanges = () => {
    if (!activeProposal) return;
    activeProposal.changes.forEach((c) => handleToggleChangeStatus(c.id, "accepted"));
  };

  const handleRejectAllChanges = () => {
    if (!activeProposal) return;
    activeProposal.changes.forEach((c) => handleToggleChangeStatus(c.id, "rejected"));
  };

  const currentPromptContent = activePrompt.versions.find((v) => v.number === activePrompt.currentVersion)?.content || "";

  // Dynamic inline editing renderer with exact line numbers aligned to active light/dark themes
  const renderPromptDocumentContent = () => {
    let currentLineNum = 1;

    if (!activeProposal || activeProposal.status !== "pending") {
      const lines = currentPromptContent.split("\n");
      return (
        <div className="font-mono text-[12px] leading-6 select-text bg-white border border-zinc-200 text-zinc-800 dark:bg-[#121212] dark:border-zinc-900 dark:text-zinc-300 p-1 rounded">
          {lines.map((line, idx) => {
            const num = currentLineNum++;
            return (
              <div key={idx} className="flex hover:bg-zinc-150/40 dark:hover:bg-zinc-900/40 px-2">
                <span className="w-10 text-zinc-400 dark:text-zinc-600 text-right pr-3 select-none border-r border-zinc-200 dark:border-zinc-800/40 mr-3 font-mono text-[11px] leading-6">
                  {num}
                </span>
                <span className="flex-1 whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">{line || " "}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="font-mono text-[11px] leading-6 select-text bg-white border border-zinc-200 text-zinc-800 dark:bg-[#121212] dark:border-zinc-900 dark:text-zinc-300">
        {activeProposal.changes.map((change, idx) => {
          const orig = ORIGINAL_BLOCKS[idx];
          const prop = activeProposal.sourceVersions && activeProposal.sourceVersions.includes(1)
            ? PROPOSED_BLOCKS_TONE_V1[idx]
            : (activeProposal.summary.includes("refined") ? PROPOSED_BLOCKS_REFINED[idx] : PROPOSED_BLOCKS[idx]);

          const isActive = idx === activeChangeIndex;

          if (change.status === "accepted") {
            const lines = prop.split("\n");
            return (
              <div key={change.id}>
                {lines.map((line, lIdx) => {
                  const num = currentLineNum++;
                  return (
                    <div key={lIdx} className="flex px-2 hover:bg-zinc-150/40 dark:hover:bg-zinc-900/40 rounded">
                      <span className="w-10 text-zinc-400 dark:text-zinc-600 text-right pr-3 select-none border-r border-zinc-200 dark:border-zinc-800/40 mr-3 font-mono text-[11px] leading-6">
                        {num}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">{line || " "}</span>
                    </div>
                  );
                })}
              </div>
            );
          }

          if (change.status === "rejected") {
            const lines = orig.split("\n");
            return (
              <div key={change.id}>
                {lines.map((line, lIdx) => {
                  const num = currentLineNum++;
                  return (
                    <div key={lIdx} className="flex px-2 hover:bg-zinc-150/40 dark:hover:bg-zinc-900/40 rounded">
                      <span className="w-10 text-zinc-400 dark:text-zinc-600 text-right pr-3 select-none border-r border-zinc-200 dark:border-zinc-800/40 mr-3 font-mono text-[11px] leading-6">
                        {num}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">{line || " "}</span>
                    </div>
                  );
                })}
              </div>
            );
          }

          const origLines = orig.split("\n");
          const propLines = prop.split("\n");

          return (
            <div
              key={change.id}
              ref={(el) => {
                blockRefs.current[idx] = el;
              }}
              onClick={() => setActiveChangeIndex(idx)}
              className={cn(
                "relative transition-all duration-200 cursor-pointer border-l-2 py-1 my-1.5",
                isActive ? "border-[#007acc] bg-[#007acc]/5" : "border-transparent"
              )}
            >
              {/* Red original/deleted block */}
              {origLines.map((line, lIdx) => {
                const num = currentLineNum++;
                return (
                  <div key={`orig-${lIdx}`} className="flex px-2 bg-red-50/70 text-red-700 dark:bg-[#2d1b1b] dark:text-[#f8a1a1] hover:bg-red-100/50 dark:hover:bg-[#3d2323]">
                    <span className="w-10 text-red-400 dark:text-red-400/50 text-right pr-3 select-none border-r border-red-100 dark:border-red-955/20 mr-3 font-mono text-[11px] leading-6">
                      {num}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap line-through text-red-700 dark:text-red-200">{line || " "}</span>
                  </div>
                );
              })}

              {/* Green suggested/added block */}
              <div className="relative">
                {propLines.map((line, lIdx) => {
                  const num = currentLineNum++;
                  return (
                    <div key={`prop-${lIdx}`} className="flex px-2 bg-emerald-50/70 text-emerald-850 dark:bg-[#142514] dark:text-[#a1f8a1] hover:bg-emerald-100/50 dark:hover:bg-[#1d351d]">
                      <span className="w-10 text-emerald-400 dark:text-emerald-400/40 text-right pr-3 select-none border-r border-emerald-100 dark:border-emerald-955/20 mr-3 font-mono text-[11px] leading-6">
                        {num}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap text-emerald-800 dark:text-emerald-100 pr-24">{line || " "}</span>
                    </div>
                  );
                })}

                {/* Floating mini action bar positioned absolute bottom-right inside the green chunk container */}
                <div className="absolute right-4 bottom-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-md shadow px-3 py-1 flex items-center gap-2 select-none font-sans text-[11px] font-bold text-zinc-600 dark:text-zinc-350 z-10 hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleChangeStatus(change.id, "accepted");
                    }}
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Accept
                  </button>
                  <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-700" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleChangeStatus(change.id, "rejected");
                    }}
                    className="hover:text-red-500 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Workspace Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/prompts"
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium flex items-center gap-1 transition-colors"
          >
            ← Prompts
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-xs text-zinc-400 font-mono">
            Quality: {activePrompt.qualityScore || 84}% · Runs: {activePrompt.usageCount || 47}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/playground?prompt=${activePrompt.id}`}
            className="text-xs border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium transition-colors"
          >
            Test prompt ↗
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row border border-zinc-200 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-black dark:border-zinc-800 shadow-sm w-full h-full relative">
        {/* Left Panel: Prompt Document */}
        <div className="w-full md:w-[60%] flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-900 h-1/2 md:h-full overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 sm:px-6 py-3 sm:py-4 dark:border-zinc-900 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                {activePrompt.title}
              </h2>
              <span className="text-xs bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded font-mono font-bold dark:bg-zinc-800 dark:text-zinc-400 shrink-0">
                v{activePrompt.currentVersion}
              </span>
            </div>
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="text-xs text-zinc-550 hover:text-zinc-850 border border-zinc-200 px-3 py-1.5 rounded-lg dark:text-zinc-400 dark:border-zinc-900 dark:hover:text-zinc-250 transition-colors shrink-0"
            >
              History
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 bg-zinc-50 dark:bg-zinc-950">
            {renderPromptDocumentContent()}
          </div>

          {/* Action / Meta Bar */}
          <div className="border-t border-zinc-100 px-4 sm:px-6 py-3 flex items-center justify-between dark:border-zinc-900 shrink-0 bg-white dark:bg-zinc-950">
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentPromptContent);
                alert("Copied");
              }}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors font-medium"
            >
              Copy prompt
            </button>
          </div>

          {/* Floating bottom-center toolbar (Approved layout) */}
          {activeProposal && activeProposal.status === "pending" && (
            (() => {
              const pendingCount = activeProposal.changes.filter((c) => c.status === "pending").length;

              if (pendingCount > 0) {
                return (
                  <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-3 sm:p-4 flex flex-col gap-2.5 z-20 shrink-0 select-none animate-in fade-in slide-in-from-bottom-2 duration-300 font-sans text-xs w-[90%] max-w-[240px]">
                    <div className="flex items-center justify-between text-zinc-650 dark:text-zinc-300 font-semibold mb-0.5">
                      <span>{pendingCount} change{pendingCount > 1 ? "s" : ""} pending</span>
                      <button
                        onClick={handleRejectAllChanges}
                        className="text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        Reject all
                      </button>
                    </div>
                    <button
                      onClick={handleAcceptAllChanges}
                      className="w-full bg-[#007acc] text-white py-1.5 rounded-md hover:bg-[#005a9c] transition-colors font-semibold"
                    >
                      Accept all
                    </button>
                  </div>
                );
              } else {
                const acceptedCount = activeProposal.changes.filter((c) => c.status === "accepted").length;
                if (acceptedCount > 0) {
                  return (
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-3 sm:p-4 flex flex-col gap-2 z-20 shrink-0 select-none animate-in fade-in slide-in-from-bottom-2 duration-300 font-sans text-xs w-[90%] max-w-[240px]">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-400 text-center">All changes reviewed</span>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={handleDiscardProposal}
                          className="flex-1 border border-zinc-200 text-zinc-650 hover:bg-zinc-50 py-1.5 rounded-md transition-colors font-semibold text-red-500 dark:border-zinc-800 dark:hover:bg-zinc-800"
                        >
                          Discard
                        </button>
                        <button
                          onClick={handleApplyProposal}
                          className="flex-1 bg-[#007acc] text-white py-1.5 rounded-md hover:bg-[#005a9c] transition-colors font-semibold"
                        >
                          Apply → v{activePrompt.currentVersion + 1}
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-3 sm:p-4 flex flex-col gap-2 z-20 shrink-0 select-none animate-in fade-in slide-in-from-bottom-2 duration-300 font-sans text-xs w-[90%] max-w-[240px]">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-400 text-center">All changes rejected</span>
                      <button
                        onClick={handleDiscardProposal}
                        className="w-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 py-1.5 rounded-md hover:opacity-90 transition-colors font-semibold mt-1"
                      >
                        Close
                      </button>
                    </div>
                  );
                }
              }
            })()
          )}
        </div>

        {/* Right Panel: Chat / Session — shadcn 2026 chat component pattern */}
        <div className="w-full md:w-[40%] flex flex-col bg-white dark:bg-zinc-950 h-1/2 md:h-full overflow-hidden border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800">

          {/* Chat Header */}
          <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-900">
            {/* Assistant icon */}
            <div className="size-6 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/symbol-logo.png" alt="AI Assistant" className="size-6 rounded-lg object-contain" />
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Session</span>
            <span className="ml-auto text-xs bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 font-mono font-bold px-2 py-0.5 rounded">
              v{activePrompt.currentVersion}
            </span>
          </div>

          {/* MessageScroller — pins scroll to bottom */}
          <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth" style={{ overflowAnchor: "none" }}>
            {activeSession.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 sm:px-8 gap-3">
                <div className="size-10 rounded-lg overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/symbol-logo.png" alt="AI Assistant" className="size-10 rounded-lg object-contain" />
                </div>
                <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">Start a conversation</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-[180px]">
                  Try &quot;Make this less verbose&quot; or &quot;Add a friendlier tone&quot;
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 px-3 sm:px-4 py-4">
                {/* Marker / session start */}
                <div className="flex items-center gap-3 py-2 mb-1">
                  <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-900" />
                  <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Session</span>
                  <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-900" />
                </div>

                {activeSession.messages.map((msg, i) => {
                  const isUser = msg.sender === "user";
                  const prevMsg = activeSession.messages[i - 1];
                  const isSameGroup = prevMsg && prevMsg.sender === msg.sender;

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2 w-full",
                        isUser ? "flex-row-reverse" : "flex-row",
                        isSameGroup ? "mt-0.5" : "mt-3"
                      )}
                    >
                      {/* Avatar — only show for first in group */}
                      {!isUser && (
                        <div className={cn(
                          "size-6 rounded-lg shrink-0 mt-1 flex items-center justify-center overflow-hidden",
                          isSameGroup ? "invisible" : ""
                        )}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/symbol-logo.png" alt="AI Assistant" className="size-6 rounded-lg object-contain" />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={cn(
                          "max-w-[88%] sm:max-w-[82%] px-3.5 py-2.5 text-[13.5px] leading-relaxed break-words",
                          isUser
                            ? [
                                "rounded-2xl rounded-tr-sm",
                                "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
                              ]
                            : [
                                "rounded-2xl rounded-tl-sm",
                                "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100",
                              ]
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} style={{ overflowAnchor: "auto", height: "1px" }} />
              </div>
            )}
          </div>

          {/* Chat Input — auto-grow textarea + icon send button */}
          <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-900 p-2.5 sm:p-3">
            <form
              onSubmit={handleSendMessage}
              className="flex items-end gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-700 transition-shadow"
            >
              <textarea
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (chatInput.trim()) handleSendMessage(e as unknown as React.FormEvent);
                  }
                }}
                placeholder="Message Dollar Prompt..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none min-h-[24px] max-h-[120px] py-0.5"
                style={{ overflowY: "hidden" }}
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className={cn(
                  "shrink-0 size-7 rounded-full flex items-center justify-center transition-all mb-0.5",
                  chatInput.trim()
                    ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                    : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                )}
              >
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </button>
            </form>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 text-center mt-1.5">
              Enter ↵ to send · Shift+Enter for newline
            </p>
          </div>
        </div>

        {/* History drawer overlay — responsive full-screen sheet on mobile */}
        {isHistoryOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
            <div className="w-full sm:w-[380px] bg-white h-full shadow-2xl flex flex-col p-4 sm:p-6 dark:bg-zinc-950 animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-900">
                <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                  Version history
                </span>
                <button
                  onClick={() => {
                    setIsHistoryOpen(false);
                    setViewingHistoryVersion(null);
                    setShowRestoreConfirm(false);
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-655"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto">
                {activePrompt.versions
                  .slice()
                  .reverse()
                  .map((v) => (
                    <div
                      key={v.number}
                      className={cn(
                        "p-3.5 border rounded-xl hover:bg-zinc-55/50 cursor-pointer dark:hover:bg-zinc-900 transition-colors border-zinc-150 dark:border-zinc-900",
                        viewingHistoryVersion?.number === v.number && "border-zinc-400 dark:border-zinc-650"
                      )}
                      onClick={() => {
                        setViewingHistoryVersion(v);
                        setShowRestoreConfirm(false);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          v{v.number} {v.number === activePrompt.currentVersion && "· active"}
                        </span>
                        <span className="text-[11px] text-zinc-400">{v.createdAt || "8 minutes ago"}</span>
                      </div>
                      <p className="text-xs text-zinc-655 dark:text-zinc-400 font-medium">
                        {v.changeSummary}
                      </p>
                    </div>
                  ))}
              </div>

              {viewingHistoryVersion && (
                <div className="border-t border-zinc-100 pt-4 mt-4 dark:border-zinc-900">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Preview v{viewingHistoryVersion.number}
                  </span>
                  <p className="text-[11.5px] text-zinc-500 mb-3 bg-zinc-55 p-2.5 rounded dark:bg-zinc-900/40">
                    Created from: &quot;{viewingHistoryVersion.createdFrom}&quot;
                  </p>

                  {showRestoreConfirm ? (
                    <div className="bg-amber-50/30 p-3 rounded-lg border border-amber-200 dark:bg-amber-955/10 dark:border-amber-955">
                      <p className="text-xs text-amber-805 dark:text-amber-400 mb-3 font-normal">
                        This will create a new version using the contents of v{viewingHistoryVersion.number}. Nothing will be deleted.
                      </p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowRestoreConfirm(false)}
                          className="text-xs text-zinc-500 hover:text-zinc-700 px-2 py-1.5"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRestoreVersion}
                          className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 font-medium"
                        >
                          Restore as v{activePrompt.currentVersion + 1}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          alert(viewingHistoryVersion.content);
                        }}
                        className="text-xs border border-zinc-200 text-zinc-655 hover:bg-zinc-50 px-3 py-2 rounded-xl dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 flex-1 transition-colors font-medium text-center"
                      >
                        View content
                      </button>
                      {viewingHistoryVersion.number !== activePrompt.currentVersion && (
                        <button
                          onClick={() => setShowRestoreConfirm(true)}
                          className="text-xs bg-zinc-900 text-white hover:bg-zinc-850 px-3 py-2 rounded-xl dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors font-semibold flex-1 text-center"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

