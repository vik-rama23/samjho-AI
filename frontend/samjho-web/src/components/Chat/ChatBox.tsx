"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  askQuestion,
  fetchChatHistory,
} from "../../services/chat.service";
import styles from "./Chat.module.scss";

type ChatMsg = {
  role: "user" | "assistant";
  message: string;
  source_type?: "document" | "internet" | "none";
  source_name?: string | null;
  sources?: string[];
};

export default function ChatBox({
  documentId,
  feature,
}: {
  documentId: number;
  feature: "qa" | "finance" | "eligibility";
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Load history
  useEffect(() => {
    if (!documentId) return;

    fetchChatHistory(feature, documentId).then((history) => {
      setMessages(
        history.map((m: any) => ({
          role: m.role,
          message: m.message,
          source_type: m.source_type,
          source_name: m.source_name,
          sources: m.sources,
        }))
      );
    });
  }, [documentId, feature]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (question: string) => {
    // User message
    setMessages((prev) => [
      ...prev,
      { role: "user", message: question },
    ]);

    setLoading(true);

    try {
      const res = await askQuestion(feature, documentId, question);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: res.answer,
          source_type: res.source_type,
          source_name: res.source_name,
          sources: res.sources,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((m, i) => (
          <ChatMessage key={i} msg={m} />
        ))}

        {loading && (
          <div className={styles.typing}>
            Samadhan AI is thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
