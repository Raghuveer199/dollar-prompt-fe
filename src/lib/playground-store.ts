"use client";

import type { PlaygroundRun } from "./types";

// In-memory only — not persisted to localStorage
const runs: PlaygroundRun[] = [];

// Mock outputs per scenario
const MOCK_OUTPUTS: Record<string, string> = {
  refund: `Hello! Thank you for reaching out to Dollar Prompt support.

I've reviewed your account and can confirm your purchase details. Based on our refund policy:

- Your purchase was made 12 days ago ✓
- You've used 6 credits so far ✓

You qualify for a **full refund** under our 30-day, under-10-credits policy.

I've initiated the refund process. You should see the credit returned to your original payment method within 3–5 business days.

Is there anything else I can help you with today?`,

  general: `Thank you for contacting us. I'd be happy to help you with that.

Let me look into this for you right away. Based on the information you've provided, here's what I can offer:

Our team takes every customer concern seriously, and we're committed to finding the best resolution for you.

Could you please provide your account email so I can pull up your details? Once I have that, I'll be able to give you a more specific answer.`,

  complaint: `I completely understand your frustration, and I sincerely apologize for the experience you've had. This is not the level of service we aim to provide.

Here's what I'm going to do right now:
1. Escalate this to our senior support team for immediate review
2. Apply a courtesy credit of $10 to your account
3. Ensure you receive a personal follow-up within 24 hours

You have my personal assurance that this will be resolved to your satisfaction. Your feedback is invaluable and directly helps us improve.

Thank you for giving us the opportunity to make this right.`,
};

export const PlaygroundStore = {
  getRuns(): PlaygroundRun[] {
    return runs;
  },

  addRun(run: PlaygroundRun): void {
    runs.unshift(run);
    if (runs.length > 50) runs.pop(); // cap at 50
  },

  getMockOutput(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes("refund") || lower.includes("money back") || lower.includes("cancel")) {
      return MOCK_OUTPUTS.refund;
    }
    if (lower.includes("frustrated") || lower.includes("angry") || lower.includes("unacceptable") || lower.includes("terrible")) {
      return MOCK_OUTPUTS.complaint;
    }
    return MOCK_OUTPUTS.general;
  },
};
