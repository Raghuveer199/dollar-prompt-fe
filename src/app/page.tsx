"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  // Interactive Hero Motion Demo State
  const [demoStep, setDemoStep] = useState<"initial" | "typing" | "proposed" | "applied">("initial");

  useEffect(() => {
    const timer1 = setTimeout(() => setDemoStep("typing"), 1200);
    const timer2 = setTimeout(() => setDemoStep("proposed"), 2800);
    const timer3 = setTimeout(() => setDemoStep("applied"), 5200);

    const loop = setInterval(() => {
      setDemoStep("initial");
      setTimeout(() => setDemoStep("typing"), 1200);
      setTimeout(() => setDemoStep("proposed"), 2800);
      setTimeout(() => setDemoStep("applied"), 5200);
    }, 8500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(loop);
    };
  }, []);

  return (
    <div className="h-full overflow-y-auto font-sans bg-[#FAFAF9] dark:bg-[#09090B] text-[#18181B] dark:text-zinc-100 selection:bg-emerald-500 selection:text-white">
      {/* 1. Minimal Editorial Marketing Navigation */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-[#FAFAF9]/90 dark:bg-[#09090B]/90 backdrop-blur-sm border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/light-full-logo.png" alt="Dollar Prompt" className="h-12 w-auto object-contain dark:hidden rounded-lg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dark-full-logo.png" alt="Dollar Prompt" className="h-12 w-auto object-contain hidden dark:block rounded-lg" />
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-white transition-colors">How it works</a>
          <a href="#thesis" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Thesis</a>
          <a href="#who" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Who it&apos;s for</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">
            Sign in
          </Link>
          <Link
            href="/create"
            className="text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3.5 py-1.5 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Create prompt →
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="w-full px-6 pt-20 pb-16 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/80 dark:bg-emerald-950/30 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mb-6">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Copilot for Prompt Engineering
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl text-zinc-950 dark:text-white">
          Your prompts deserve version control.
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed font-normal">
          Build, refine, and evolve prompts with AI — without losing the version that worked.
        </p>

        <div className="flex items-center gap-4 mt-8">
          <Link
            href="/create"
            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm hover:shadow"
          >
            Create your first prompt →
          </Link>
          <a
            href="#how-it-works"
            className="border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-6 py-3 rounded-xl text-sm font-medium hover:bg-zinc-100/60 dark:hover:bg-zinc-900 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* 3. Interactive Hero Motion Component */}
        <div className="w-full max-w-3xl mt-14 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl bg-white dark:bg-zinc-950 overflow-hidden text-left font-mono text-xs">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2">
              <span className="font-semibold font-sans text-zinc-900 dark:text-zinc-100">Customer Support Agent</span>
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                {demoStep === "applied" ? "v13 · Active" : "v12"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-sans">
              <span className="size-2 rounded-full bg-emerald-500"></span>
              Live Sync
            </div>
          </div>

          {/* Editor Body Split */}
          <div className="grid md:grid-cols-12 min-h-[300px]">
            {/* Left Prompt Document */}
            <div className="md:col-span-7 p-5 space-y-3 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
              <div className="text-zinc-400 text-[11px] font-sans font-medium uppercase tracking-wider mb-2">Canonical Prompt</div>

              {demoStep !== "applied" && (
                <div className={cn("p-2 rounded transition-colors duration-300", demoStep === "proposed" && "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 line-through")}>
                  You are a professional customer support agent for Dollar Prompt. Your primary responsibility is handling customer refund requests in a polite, helpful, and clear manner.
                </div>
              )}

              {demoStep === "proposed" && (
                <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-300">
                  You are a customer support agent. Help customers with refund requests professionally and clearly.
                </div>
              )}

              {demoStep === "applied" && (
                <div className="p-2 rounded bg-emerald-50/50 dark:bg-emerald-950/10 text-zinc-800 dark:text-zinc-200">
                  You are a customer support agent. Help customers with refund requests professionally and clearly.
                </div>
              )}

              <div className="p-2 text-zinc-600 dark:text-zinc-400">
                REFUND RULES:<br />
                1. Full refund within 30 days if &lt; 10 credits used.<br />
                2. Partial refund (50%) within 30 days if &gt;= 10 credits used.<br />
                3. No refund after 30 days.
              </div>
            </div>

            {/* Right Interactive Chat Panel */}
            <div className="md:col-span-5 p-4 bg-zinc-50/50 dark:bg-zinc-900/20 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-[10px] text-zinc-400 font-sans font-semibold uppercase tracking-wider">Instruction Log</div>

                {(demoStep === "typing" || demoStep === "proposed" || demoStep === "applied") && (
                  <div className="bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 p-2.5 rounded-xl text-[11px] font-sans ml-auto max-w-[90%] animate-in fade-in duration-200">
                    Make this less verbose.
                  </div>
                )}

                {(demoStep === "proposed" || demoStep === "applied") && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl space-y-2 text-[11px] font-sans text-zinc-800 dark:text-zinc-200 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
                      <span>PROPOSED CHANGE</span>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">142 → 61 words</span>
                    </div>
                    <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-tight">Shortened intro while preserving refund rules.</p>

                    <div className="flex gap-1.5 pt-1">
                      <span className={cn("text-[10px] px-2 py-1 rounded font-semibold transition-colors", demoStep === "applied" ? "bg-emerald-600 text-white" : "bg-emerald-600 text-white hover:bg-emerald-700")}>
                        {demoStep === "applied" ? "✓ Applied v13" : "Apply → v13"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-zinc-400 font-sans text-center mt-4">
                {demoStep === "initial" && "Waiting for user instruction..."}
                {demoStep === "typing" && "Analyzing prompt structure..."}
                {demoStep === "proposed" && "Review proposed inline edit..."}
                {demoStep === "applied" && "New version v13 created!"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Thesis */}
      <section id="thesis" className="w-full px-6 py-20 border-t border-zinc-200/60 dark:border-zinc-800/60 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-12">
          The prompt stays. The conversation works on it.
        </h2>

        <div className="grid sm:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm block mb-3">01 — Prompt</span>
            <h3 className="font-semibold text-base mb-2 text-zinc-900 dark:text-white">Your primary artifact</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your prompt is always visible in full on screen. Copyable, inspectable, and never hidden behind a chat message wall.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm block mb-3">02 — Conversation</span>
            <h3 className="font-semibold text-base mb-2 text-zinc-900 dark:text-white">Instruct in plain English</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Tell Dollar Prompt what to improve. AI interprets your goals and targets specific sections without rewriting everything.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm block mb-3">03 — Versions</span>
            <h3 className="font-semibold text-base mb-2 text-zinc-900 dark:text-white">Zero lost history</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every accepted change automatically creates a clean new version. Restore any past state without losing lineage.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Contrast Section */}
      <section id="how-it-works" className="w-full px-6 py-20 bg-zinc-100/50 dark:bg-zinc-900/20 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Stop rewriting prompts in a chat box.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl mx-auto mb-14">
            Chat is the interface. The prompt is the product.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Traditional AI */}
            <div className="p-6 rounded-2xl border border-red-200/60 dark:border-red-950/40 bg-white dark:bg-zinc-950">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider block mb-4">Traditional AI Chat</span>
              <div className="space-y-2.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                <p><span className="text-red-500">You:</span> &quot;Make my prompt better&quot;</p>
                <p><span className="text-zinc-400">AI:</span> &quot;Sure! Here is an improved version...&quot;</p>
                <div className="pt-2 space-y-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <p className="flex items-center gap-1.5">
                    <svg className="size-3 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Manual copy & paste
                  </p>
                  <p className="flex items-center gap-1.5">
                    <svg className="size-3 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Wonder what actually changed
                  </p>
                  <p className="flex items-center gap-1.5">
                    <svg className="size-3 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Lose the old version that worked
                  </p>
                </div>
              </div>
            </div>

            {/* Dollar Prompt */}
            <div className="p-6 rounded-2xl border border-emerald-200/80 dark:border-emerald-950/60 bg-white dark:bg-zinc-950 shadow-sm">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-4">Dollar Prompt</span>
              <div className="space-y-2 font-mono text-xs text-zinc-800 dark:text-zinc-200">
                <p className="font-semibold text-zinc-900 dark:text-white">Your Prompt Document</p>
                <p className="text-emerald-600 dark:text-emerald-400">↓ &quot;Make it less verbose&quot;</p>
                <p className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded border border-emerald-100 dark:border-emerald-900">Proposed inline edit (142 → 61 words)</p>
                <p className="text-zinc-500">↓ Review & Accept</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Apply → v8 (Saved & Versioned)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Proposal Showcase */}
      <section className="w-full px-6 py-20 border-t border-zinc-200/60 dark:border-zinc-800/60 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
          AI doesn&apos;t silently rewrite your work.
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-10">It proposes. You decide.</p>

        <div className="max-w-md mx-auto p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg text-left font-sans">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            <span>PROPOSED CHANGE</span>
            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded text-[11px]">Pending</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
            Shortened the instructions while preserving refund rules and output formatting.
          </p>
          <div className="text-[11px] font-mono bg-zinc-50 dark:bg-zinc-900 p-2 rounded mb-4 text-zinc-500">
            Instructions: 142 words → 61 words
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 px-3 py-1.5">Discard</span>
            <span className="text-xs border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300">Refine</span>
            <span className="text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-semibold ml-auto">Apply → v14</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12 text-left text-xs text-zinc-500 dark:text-zinc-400">
          <p>✓ No automatic rewrites</p>
          <p>✓ No wondering what changed</p>
          <p>✓ No accidental prompt destruction</p>
        </div>
      </section>

      {/* 7. Emotional Payoff */}
      <section className="w-full px-6 py-24 bg-zinc-900 text-white dark:bg-zinc-950 dark:border-t dark:border-zinc-900 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Stop being afraid to improve a prompt.
          </h2>
          <p className="text-zinc-400 text-base font-normal pt-2">
            Experiment freely. Your good version is still right there.
          </p>

          <div className="pt-8">
            <Link
              href="/create"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-3.5 rounded-xl font-bold text-sm transition-all"
            >
              Create your prompt now →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Who It's For */}
      <section id="who" className="w-full px-6 py-20 max-w-5xl mx-auto text-center border-t border-zinc-200/60 dark:border-zinc-800/60">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-10">
          For people who have prompts worth keeping.
        </h2>

        <div className="grid sm:grid-cols-3 gap-6 text-left">
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
            <h3 className="font-semibold text-sm mb-1 text-zinc-900 dark:text-white">AI Builders</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Developing system prompts and complex agent instructions.</p>
          </div>
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
            <h3 className="font-semibold text-sm mb-1 text-zinc-900 dark:text-white">Power Users</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Prompts you use every day and continuously tweak for performance.</p>
          </div>
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
            <h3 className="font-semibold text-sm mb-1 text-zinc-900 dark:text-white">Teams & Creators</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Prompts that form part of a repeatable production workflow.</p>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <footer className="w-full px-6 py-16 border-t border-zinc-200 dark:border-zinc-900 text-center bg-zinc-50/50 dark:bg-zinc-950">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
          Your next prompt can be version 1.
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          Create it. Improve it. Keep every version that matters.
        </p>

        <Link
          href="/create"
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity inline-block"
        >
          Create your first prompt →
        </Link>
      </footer>
    </div>
  );
}
