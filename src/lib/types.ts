// Shared domain types for Dollar Prompt
// Centralized here so all components import from @/lib/types

export interface Version {
  number: number;
  content: string;
  parent?: number;
  changeSummary: string;
  createdAt: string;
  createdFrom: string;
}

export interface ProposedChange {
  id: string;
  section: string;
  before: string;
  after: string;
  summary: string;
  status: "pending" | "accepted" | "rejected";
}

export interface Proposal {
  id: string;
  baseVersion: number;
  changes: ProposedChange[];
  summary: string;
  status: "pending" | "applied" | "discarded";
  sourceVersions?: number[];
}

export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  type: "plain" | "proposal";
  proposal?: Proposal;
}

export interface Session {
  id: string;
  promptId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  description?: string;
  currentVersion: number;
  versions: Version[];
  sessions: Session[];
  createdAt: string;
  updatedAt: string;
  // Extended fields
  isFavorite?: boolean;
  collectionIds?: string[];
  tags?: string[];
  usageCount?: number;
  qualityScore?: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;       // emoji
  color: string;      // tailwind bg token (e.g. "bg-blue-50")
  promptIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: "work" | "writing" | "coding" | "research" | "marketing";
  content: string;
  usageCount: number;
  tags: string[];
}

export interface PlaygroundRun {
  id: string;
  promptId: string;
  promptVersion: number;
  input: string;
  output: string;
  createdAt: string;
}
