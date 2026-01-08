"use client";

import md from "../../utils/markdown";
import styles from "./Chat.module.scss";

export default function ChatMessage({ msg }: { msg: any }) {
  if (!msg) return null;
  console.log("message", msg)
  const text =
    typeof msg.message === "string"
      ? msg.message
      : typeof msg.message === "string"
      ? msg.message
      : "";
  const chatMessage = md?.render(text);
  const sender = msg.role || "user";
  return (
    <div>
    <div className={`${styles.message} ${styles[sender]}`}
        dangerouslySetInnerHTML={{
          __html:chatMessage
        }}
      />

      {msg.source_type === "document" && (
        <div className={styles.source}>
          📄 Source: <strong>{msg.source_name}</strong>
        </div>
      )}

      {msg.source_type === "internet" && (
        <div className={styles.source}>
          🌐 Sources:
          <ul>
            {msg.sources?.map((s: any, i: number) => {
              const url =
              typeof s === "string" ? s.trim() : s && s.url ? String(s.url).trim() : "";
              const title = typeof s === "object" && s?.title ? s.title : url;
              if (!url) return null;
              return (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
