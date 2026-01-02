"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  askQuestion,
  fetchChatHistory,
} from "../../services/chat.service";
import { normalizeMessage } from "../../utils/chatNormalizer";
import styles from "./Chat.module.scss";

type ChatMsg = {
  role: "user" | "assistant";
  message: string;
  source_type?: "document" | "internet" | "none";
  source_name?: string | null;
  sources?: any[];
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

  useEffect(() => {
    if (!documentId) return;
    fetchChatHistory(feature, documentId)
      .then((res) => {
        const history = feature === 'finance' ? res.messages : res ?? [];
        setMessages(history.map(normalizeMessage));
      })
      .catch(() => {
        setMessages([]);
      });
  }, [documentId, feature]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (question: string) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        message: question,
      },
    ]);

    setLoading(true);

    try {
      const res = await askQuestion(feature, documentId, question);

      setMessages((prev) => [
        ...prev,
        normalizeMessage(res),
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: "Something went wrong. Please try again.",
          source_type: "none",
          sources: [],
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
