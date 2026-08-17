import { PromptWorkspace } from "@/components/prompt-studio";

export default async function PromptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PromptWorkspace promptId={resolvedParams.id} />;
}
