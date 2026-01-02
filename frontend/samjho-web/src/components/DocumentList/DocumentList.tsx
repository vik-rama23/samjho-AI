"use client";

import styles from "./DocumentList.module.scss";

type Document = {
  id: number;
  title: string;
  domain: string;
  created_at?: string;
};

export default function DocumentList({
  documents,
  selectedId,
  onSelect,
  onUploadNew,
}: {
  documents: any[];
  selectedId: number | null;
  onSelect: (doc: any) => void;
  onUploadNew: () => void;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Your Documents</h3>
        <button onClick={onUploadNew}>+ Upload New</button>
      </div>

      <div className={styles.list}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`${styles.card} ${
              selectedId === doc.id ? styles.active : ""
            }`}
            onClick={() => onSelect(doc)}
          >
            <div>
              <h4>{doc.title}</h4>
              <span className={`${styles.badge} ${styles[doc.domain]}`}>
                {doc.domain}
              </span>
            </div>
            <span className={styles.ready}>Ready</span>
          </div>
        ))}
      </div>
    </div>
  );
}

