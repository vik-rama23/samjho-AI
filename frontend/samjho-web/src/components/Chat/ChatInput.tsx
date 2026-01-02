"use client";

import { useState } from "react";
import styles from "./Chat.module.scss";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled: boolean;
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
        placeholder="Ask a question based on uploaded documents…"
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
