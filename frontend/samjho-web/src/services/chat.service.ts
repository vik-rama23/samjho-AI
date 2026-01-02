import api from "./api";

export async function askQuestion(
  feature: "qa" | "finance" | "eligibility",
  documentId: number,
  question: string
) {
  const res = await api.post(`${feature}/ask`, {
    document_id: documentId,
    question,
  });

  return res.data;
}

export async function fetchChatHistory(
  feature: "qa" | "finance" | "eligibility",
  documentId: number
) {
  const res = await api.get(
    `/${feature}/history?document_id=${documentId}`
  );

  console.log("res", res)
  return res.data.messages || [];
}
