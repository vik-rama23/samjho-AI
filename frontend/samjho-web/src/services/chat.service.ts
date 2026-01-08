import api from "./api";

export async function askQuestion(
  feature: "qa" | "finance" | "eligibility",
  documentId: number,
  question: string,
  sourceMode: string
) {
  const res = await api.post(`${feature}/ask`, {
    document_id: documentId,
    question,
    source_mode: sourceMode
  });

  return res.data;
}

export async function fetchChatHistory(
  feature: "qa" | "finance" | "eligibility",
  documentId: number,
  sourceMode: string  
) {
  const res = await api.get(`/${feature}/history`,{
    params: {
      document_id: documentId,
      source_mode: sourceMode
    }
  });
  return res.data.messages.map((m:any) => ({
    role: m.role === "assistant" ? "bot" : "user",
    message: m.answer,
    source_type: m.source_type,
    source_name: m.source_name,
    sources: m.sources
  })) || [];
}



