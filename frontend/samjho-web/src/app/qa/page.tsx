"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TwoColumnLayout from "../../components/Layout/TwoColumnLayout";
import Sidebar from "../../components/Layout/Sidebar";
import ChatBox from "../../components/Chat/ChatBox";
import UploadForm from "../../components/UploadDocument/UploadForm";
import { fetchDocuments } from "../../services/documents.service";
import { filterDocumentsByFeature } from "../../utils/domainFilter";
import EmptyState from "../../components/Common/EmptyState";
import Header from "../../components/Header/Header";

export default function QA() {
  const router = useRouter();

  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);

  const loadDocs = async () => {
    const docs = await fetchDocuments();
    const qaDocs = filterDocumentsByFeature(docs, "qa");
    setDocuments(qaDocs);
    if (!selectedDoc && qaDocs.length > 0) {
      setSelectedDoc(qaDocs[0]);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    loadDocs();
  }, []);


  if (showUpload) {
    return <UploadForm onSuccess={() => location.reload()} />;
  }

  return (
    <>
      <Header />

      <TwoColumnLayout
        sidebar={
          <Sidebar
            title="History"
            documents={documents}
            selectedId={selectedDoc?.id}
            onSelect={setSelectedDoc}
            onDeleted={loadDocs}
          />
        }
      >
        {selectedDoc && (
          <>
            <h2>Information about: {selectedDoc.title}</h2>
            {documents.length === 0 ? (
              <EmptyState
                title="No documents uploaded"
                description="Upload related document to start asking questions."
              />
            ) : (
              <ChatBox documentId={selectedDoc.id} feature="qa" />
            )}
          </>
        )}
      </TwoColumnLayout>
    </>
  );
}
