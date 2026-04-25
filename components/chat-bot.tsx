"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  role: string;
  content: string;
  timestamp?: string;
};

function formatTs(ts?: string): string {
  if (!ts) return "";
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${mm}/${dd} ${HH}:${min}:${ss}`;
}

export function ChatBot({ isQuotaFull }: { isQuotaFull: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 初始化聊天与持久化
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    const savedId = localStorage.getItem("chat_session_id");

    const timer = setTimeout(() => {
      if (saved && savedId) {
        setMessages(JSON.parse(saved));
        setChatId(savedId);
      } else {
        const newId = crypto.randomUUID();
        const greeting = "你好！我是小灵，这个网站的 AI 助手。有什么关于网站或作者 Zeli 的问题，欢迎随时提问。\n请注意：AI 生成的回答仅供参考，内容可能存在错误。\n\nこんにちは！私はレイ、このサイトの AI アシスタントです。サイトや作者の Zeli についてご質問があれば、お気軽にどうぞ。\nAI の回答は参考情報としてご利用ください。内容の正確性を保証するものではありません。\n\nHello! I'm Ling, the AI assistant for this site. Feel free to ask me anything about the site or its author, Zeli.\nPlease note: AI-generated responses are for reference only and may not always be accurate.";
        const now = new Date().toISOString();
        setMessages([{ role: "assistant", content: greeting, timestamp: now }]);
        setChatId(newId);
        localStorage.setItem("chat_session_id", newId);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. 自动滚动到底部
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  if (isQuotaFull) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const now = new Date().toISOString();
    const userMsg: Message = { role: "user", content: input, timestamp: now };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: newMessages,
          chatId: chatId,
        }),
      });

      if (res.ok) {
        const aiMsg: Message = await res.json();
        const fullHistory = [...newMessages, aiMsg];
        setMessages(fullHistory);
        localStorage.setItem("chat_history", JSON.stringify(fullHistory));
      } else {
        const errorText = await res.text();
        const errMsg: Message = { role: "assistant", content: `(System: ${errorText})`, timestamp: new Date().toISOString() };
        setMessages([...newMessages, errMsg]);
      }
    } catch {
      const errMsg: Message = { role: "assistant", content: "Connection failed. Please try again later.", timestamp: new Date().toISOString() };
      setMessages([...newMessages, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 h-[450px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="p-4 bg-emerald-500 text-white font-bold flex justify-between">
            <span>AI Assistant</span>
            <button onClick={() => setIsOpen(false)} className="cursor-pointer">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const ts = formatTs(m.timestamp);
              return (
                <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  {ts && (
                    <span className="text-[10px] text-slate-400 mb-1 px-1">{ts}</span>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    isUser
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  }`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            {isLoading && <div className="text-xs text-slate-400 animate-pulse">Thinking...</div>}
            <div ref={scrollRef} />
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button onClick={handleSend} className="bg-emerald-500 text-white p-2 rounded-xl cursor-pointer">🚀</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
