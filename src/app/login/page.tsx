"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { PromptStore } from "@/lib/prompt-store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const { login, getAnonymousDraft, clearAnonymousDraft } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!email.trim()) {
      setEmailError("Please enter your email.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      valid = false;
    }

    return valid;
  };

  const completeLoginSuccess = (userEmail: string) => {
    login(userEmail);
    // Check if there is an anonymous draft to migrate
    const draft = getAnonymousDraft();
    let target = redirectTarget;
    if (draft && draft.title) {
      const createdPrompt = PromptStore.createPrompt({
        title: draft.title || "Untitled Draft Prompt",
        category: draft.category || "General",
        initialContent: draft.initialContent || "",
        tags: draft.tags || ["draft"],
      });
      clearAnonymousDraft();
      target = `/prompt/${createdPrompt.id}`;
    }

    setIsSuccess(true);
    setTimeout(() => {
      router.push(target);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (email.trim().toLowerCase() === "invalid@example.com") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setGeneralError("We couldn't sign you in with those details.");
      }, 1000);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      completeLoginSuccess(email.trim());
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setGeneralError("");
    setTimeout(() => {
      setIsGoogleLoading(false);
      completeLoginSuccess("google.user@example.com");
    }, 1400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) return;
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#FAFAF9] dark:bg-[#090D14] text-zinc-900 dark:text-zinc-100 font-sans relative overflow-y-auto">
      {/* Background Accent Treatment */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[500px] bg-gradient-to-b from-[#0066FF]/10 to-transparent blur-3xl rounded-full opacity-60 dark:opacity-30" />
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-[420px] bg-white dark:bg-[#121824] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl p-6 sm:p-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/symbol-logo.png" alt="Dollar Prompt" className="size-12 rounded-lg object-contain" />
          </Link>
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
            Sign in to continue to your AI prompt workspace.
          </p>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 animate-in fade-in duration-200 flex items-center gap-2">
            <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{generalError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading || isSuccess}
                placeholder="you@example.com"
                className={cn(
                  "w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:outline-none focus:ring-2",
                  emailError
                    ? "border-red-300 dark:border-red-800 focus:ring-red-200 dark:focus:ring-red-950"
                    : "border-zinc-200 dark:border-zinc-800 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
                )}
              />
            </div>
            {emailError && (
              <p className="text-[11px] text-red-500 mt-1 font-medium animate-in fade-in duration-150">
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-semibold text-[#0066FF] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading || isSuccess}
                placeholder="••••••••"
                className={cn(
                  "w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:outline-none focus:ring-2",
                  passwordError
                    ? "border-red-300 dark:border-red-800 focus:ring-red-200 dark:focus:ring-red-950"
                    : "border-zinc-200 dark:border-zinc-800 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1"
              >
                {showPassword ? (
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-[11px] text-red-500 mt-1 font-medium animate-in fade-in duration-150">
                {passwordError}
              </p>
            )}
          </div>

          {/* Primary Sign In Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading || isSuccess}
            className={cn(
              "w-full h-10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-xs",
              isSuccess
                ? "bg-emerald-600 hover:bg-emerald-600"
                : "bg-[#0066FF] hover:bg-[#0052CC] active:scale-[0.99]",
              (isLoading || isGoogleLoading) && "opacity-80 cursor-wait"
            )}
          >
            {isSuccess ? (
              <>
                <svg className="size-4 animate-in zoom-in duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Welcome back</span>
              </>
            ) : isLoading ? (
              <>
                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <span className="relative bg-white dark:bg-[#121824] px-3 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading || isSuccess}
          className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all flex items-center justify-center gap-2.5 shadow-2xs active:scale-[0.99]"
        >
          {isGoogleLoading ? (
            <>
              <svg className="size-4 animate-spin text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Sign up prompt footer */}
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#0066FF] font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>

      {/* Forgot Password Prototype Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            setShowForgotModal(false);
            setForgotSent(false);
          }}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#121824] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
              Reset password
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Enter your email and we&apos;ll send you a password reset link.
            </p>

            {forgotSent ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-xl text-center space-y-2">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Reset link sent!
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Check your inbox at <span className="font-mono">{forgotEmail || "your email"}</span> for instructions.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="mt-2 text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-emerald-700"
                >
                  Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 px-3 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs bg-[#0066FF] hover:bg-[#0052CC] text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                  >
                    Send reset link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF9] dark:bg-[#090D14]" />}>
      <LoginForm />
    </Suspense>
  );
}
