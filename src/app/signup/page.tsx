"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (!name.trim()) {
      setNameError("Please enter your full name.");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Please enter a password.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#FAFAF9] dark:bg-[#090D14] text-zinc-900 dark:text-zinc-100 font-sans relative overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#0066FF]/10 to-transparent blur-3xl rounded-full opacity-60 dark:opacity-30" />
      </div>

      <div className="w-full max-w-[420px] bg-white dark:bg-[#121824] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl p-6 sm:p-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/symbol-logo.png" alt="Dollar Prompt" className="size-12 object-contain" />
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Create your account
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
            Start building and versioning prompts with AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading || isSuccess}
              placeholder="Jane Doe"
              className={cn(
                "w-full text-xs px-3.5 py-2.5 rounded-xl border bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:outline-none focus:ring-2",
                nameError
                  ? "border-red-300 dark:border-red-800 focus:ring-red-200"
                  : "border-zinc-200 dark:border-zinc-800 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
              )}
            />
            {nameError && <p className="text-[11px] text-red-500 mt-1 font-medium">{nameError}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isSuccess}
              placeholder="you@example.com"
              className={cn(
                "w-full text-xs px-3.5 py-2.5 rounded-xl border bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:outline-none focus:ring-2",
                emailError
                  ? "border-red-300 dark:border-red-800 focus:ring-red-200"
                  : "border-zinc-200 dark:border-zinc-800 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
              )}
            />
            {emailError && <p className="text-[11px] text-red-500 mt-1 font-medium">{emailError}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isSuccess}
              placeholder="At least 6 characters"
              className={cn(
                "w-full text-xs px-3.5 py-2.5 rounded-xl border bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:outline-none focus:ring-2",
                passwordError
                  ? "border-red-300 dark:border-red-800 focus:ring-red-200"
                  : "border-zinc-200 dark:border-zinc-800 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
              )}
            />
            {passwordError && <p className="text-[11px] text-red-500 mt-1 font-medium">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className={cn(
              "w-full h-10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-xs",
              isSuccess ? "bg-emerald-600" : "bg-[#0066FF] hover:bg-[#0052CC]"
            )}
          >
            {isSuccess ? (
              <span>Account created! Redirecting...</span>
            ) : isLoading ? (
              <span>Creating account...</span>
            ) : (
              <span>Create account</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0066FF] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
