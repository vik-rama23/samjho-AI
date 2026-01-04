"use client";

import styles from "./Sidebar.module.scss";
import { deleteDocument } from "../../services/documents.service";

export default function Sidebar({
  title,
  documents,
  selectedId,
  onSelect,
  onDeleted,
}: {
  title: string;
  documents: any[];
  selectedId?: number;
  onSelect: (doc: any) => void;
  onDeleted: () => void;
}) {
  const handleDelete = async (
    e: React.MouseEvent,
    docId: number
  ) => {
    e.stopPropagation();

    const confirmed = confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmed) return;

    await deleteDocument(docId);
    onDeleted();
  };

  return (
    <div>
      <h3>{title}</h3>

      {documents?.length === 0 && (
        <p className={styles.empty}>No documents yet</p>
      )}

      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`${styles.item} ${
            selectedId === doc.id ? styles.active : ""
          }`}
          onClick={() => onSelect(doc)}
        >
          <span className={styles.title}>{doc.title}</span>

          <button
            className={styles.delete}
            onClick={(e) => handleDelete(e, doc.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
