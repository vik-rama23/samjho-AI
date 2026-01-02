export type ChatMessageType = {
  role: "user" | "assistant";
  message: string;
  source_type?: "document" | "internet" | "none";
  source_name?: string | null;
  sources?: any[];
};

export function normalizeMessage(raw: any): ChatMessageType {
  if (raw?.message?.message) {
        console.log("getting called case 1")
    return {
      role: raw.message.role ?? "assistant",
      message: raw.message.message,
      source_type: raw.message.source_type ?? "none",
      source_name: raw.message.source_name ?? null,
      sources: raw.message.sources ?? [],
    };
  }

  // Case 2: Ask API flat response
  if (raw?.answer) {
    console.log("raw", raw.role)
    return {
      role: raw.role,
      message: raw.answer,
      source_type: raw.source_type ?? "none",
      source_name: raw.source_name ?? null,
      sources: raw.sources ?? [],
    };
  }

  // Case 3: History API message
  if (raw?.message && raw?.role) {
    console.log("getting called case 3")
    return {
      role: raw.role,
      message: raw.message,
      source_type: raw.source_type ?? "none",
      source_name: raw.source_name ?? null,
      sources: raw.sources ?? [],
    };
  }

  // Fallback safety
  return {
    role: raw.role,
    message: String(raw),
    source_type: "none",
    source_name: null,
    sources: [],
  };
}
