import api from "./api";

export async function fetchDocuments() {
  const res = await api.get("/documents");
  return res.data.documents || [];
}

export async function uploadDocument(formData: FormData) {
  const res = await api.post("/documents/upload", formData);
  return res.data;
}

export async function deleteDocument(id: number) {
  await api.delete(`/documents/${id}`);
}
