"use client";

import { useEffect, useState } from "react";
import TwoColumnLayout from "../../components/Layout/TwoColumnLayout";
import Sidebar from "../../components/Layout/Sidebar";
import ChatBox from "../../components/Chat/ChatBox";
import { fetchDocuments } from "../../services/documents.service";
import { filterDocumentsByFeature } from "../../utils/domainFilter";
import EmptyState from "../../components/Common/EmptyState";
import Header from "@/src/components/Header/Header";

export default function Eligibility() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const loadDocs = async () => {
    const docs = await fetchDocuments();
    const qaDocs = filterDocumentsByFeature(docs, "qa");
    setDocuments(qaDocs);
    if (!selectedDoc && qaDocs.length > 0) {
      setSelectedDoc(qaDocs[0]);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);


  return (
    <>
      <Header />
      <TwoColumnLayout
        sidebar={
          <Sidebar
            title="Eligibility History"
            documents={documents}
            selectedId={selectedDoc?.id}
            onSelect={setSelectedDoc}
            onDeleted={loadDocs}
          />
        }
      >
        {selectedDoc && (
          <>
            <h2>Eligibility check for: {selectedDoc.title}</h2>
            {documents.length === 0 ? (
              <EmptyState
                title="No eligibility documents uploaded"
                description="Upload a eligibility-related document to start asking questions."
              />
            ) : (
              <ChatBox documentId={selectedDoc.id} feature="eligibility" />
            )}
          </>
        )}
      </TwoColumnLayout>
    </>

  );
}
