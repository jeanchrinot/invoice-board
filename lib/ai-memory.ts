// lib/ai-memory.ts
const sessionDraftMap = new Map<string, string>();

export function setSelectedDraft(userId: string, draftId: string) {
  sessionDraftMap.set(userId, draftId);
}

export function getSelectedDraft(userId: string): string | undefined {
  return sessionDraftMap.get(userId);
}
