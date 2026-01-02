"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./UploadForm.module.scss";
import { uploadDocument } from "../../services/documents.service";

export default function UploadForm({
  onSuccess,
}: {
  onSuccess?: (doc: any) => void;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("education");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!title || !file) {
      alert("Title and PDF file are required");
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
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Document</h2>
      <p className={styles.subtext}>
        Upload PDFs to enable document-based chat
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
            <option value="eligibility">Eligibility</option>
            <option value="policy">Policy</option>
          </select>
        </label>

        <label className={styles.dropzone}>
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <span>
            {file
              ? `📄 ${file.name}`
              : "Drag & drop PDF here or click to browse"}
          </span>
        </label>

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing…" : "Upload & Process"}
        </button>

        {status && <p className={styles.status}>{status}</p>}
      </div>
    </div>
  );
}
