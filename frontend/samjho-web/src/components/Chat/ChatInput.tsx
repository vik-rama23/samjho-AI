"use client";

import { useState } from "react";
import styles from "./Chat.module.scss";

export default function ChatInput({
  onSend,
  disabled,
  sourceMode
}: {
  onSend: (msg: string) => void;
  disabled: boolean;
  sourceMode: string
}) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className={styles.inputBox}>
      <input
        placeholder={
            sourceMode === "document"
              ? "Ask from document…"
              : "Ask from internet…"
          }
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        disabled={disabled}
      />
      <button onClick={send} disabled={disabled}>
        Send
      </button>
    </div>
  );
}
