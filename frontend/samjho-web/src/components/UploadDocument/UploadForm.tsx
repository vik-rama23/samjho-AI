"use client";

import { useEffect, useState } from "react";
import styles from "./UploadForm.module.scss";
import { uploadDocument } from "../../services/documents.service";
import { fetchDocuments } from "../../services/documents.service";

const MAX_DOCS = 15;
const MAX_TOTAL_BYTES = 30 * 1024 * 1024;

export default function UploadForm({
  onSuccess,
}: {
  onSuccess?: (doc: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("education");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [docsCount, setDocsCount] = useState(0);
  const [usedBytes, setUsedBytes] = useState(0);

  useEffect(() => {
    fetchDocuments().then((docs) => {
      setDocsCount(docs.length);
      setUsedBytes(
        docs.reduce(
          (sum: number, d: any) => sum + (d.file_size || 0),
          0
        )
      );
    });
  }, []);

  const handleUpload = async () => {
    if (!title || !file) {
      setStatus("Title and PDF file are required");
      return;
    }

    if (docsCount >= MAX_DOCS) {
      setStatus("You can upload a maximum of 2 documents.");
      return;
    }

    if (usedBytes + file.size > MAX_TOTAL_BYTES) {
      setStatus("Total document size cannot exceed 15 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("domain", domain);
    formData.append("file", file);

    try {
      setLoading(true);
      setStatus("Uploading & processing document…");

      const doc = await uploadDocument(formData);

      setStatus("Document processed successfully ✅");
      onSuccess?.(doc);
    } catch (err: any) {
      setStatus(
        err?.response?.data?.detail || "Something went wrong ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  const usedMB = (usedBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Document</h2>

      <p className={styles.subtext}>
        {docsCount}/{MAX_DOCS} documents used · {usedMB}MB / 30MB
      </p>

      <div className={styles.form}>
        <label className={styles.label1}>
          Document Title
          <input
            placeholder="e.g. NEP 2020"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          Domain
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option value="education">Education</option>
            <option value="finance">Finance</option>
            <option value="policy">Policy</option>
          </select>
        </label>

        <label className={styles.dropzone}>
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />
          <span>
            {file
              ? `📄 ${file.name}`
              : "Drag & drop PDF here or click to browse"}
          </span>
        </label>

        <button
          onClick={handleUpload}
          disabled={loading || docsCount >= MAX_DOCS}
        >
          {loading ? "Processing…" : "Upload & Process"}
        </button>

        {status && <p className={styles.status}>{status}</p>}
      </div>
    </div>
  );
}
