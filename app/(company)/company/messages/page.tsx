"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Send, Smile, Paperclip, X, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  conversationsApi,
  type ApiConversation,
  type ApiMessage,
} from "@/lib/api/conversations";

const EMOJIS = [
  "😊","😂","😍","😅","😎","🤔","😢","😡","🥳","🤩",
  "👍","👋","👏","🙏","💪","🤝","❤️","🔥","⭐","🎉",
  "✅","❌","💡","🚀","🎯","📌","⚠️","🔑","📎","📧",
];

function CompanyMessagesInner() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [selectedId, setSelectedId]       = useState<number | null>(null);
  const [messages, setMessages]           = useState<ApiMessage[]>([]);
  const [inputText, setInputText]         = useState("");
  const [pendingFile, setPendingFile]     = useState<File | null>(null);
  const [loadingConvs, setLoadingConvs]   = useState(true);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [sending, setSending]             = useState(false);
  const [showEmoji, setShowEmoji]         = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef     = useRef(false);
  const emojiRef       = useRef<HTMLDivElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchMessages = useCallback(async (convId: number) => {
    try {
      const r = await conversationsApi.companyMessages(convId);
      const data = Array.isArray(r?.data) ? r.data : [];
      setMessages(data);
      conversationsApi.companyMarkRead(convId).catch(() => {});
    } catch { /* keep */ }
  }, []);

  const fetchConversations = useCallback(async (): Promise<ApiConversation[]> => {
    try {
      const r = await conversationsApi.companyList();
      const data = Array.isArray(r?.data) ? r.data : [];
      setConversations(data);
      return data;
    } catch {
      return [];
    }
  }, []);

  // Initial load + optional auto-start from query params
  useEffect(() => {
    const candidateId = searchParams.get("candidateId");
    const jobId       = searchParams.get("jobId");

    (async () => {
      try {
        const list = await fetchConversations();

        if (candidateId && !startedRef.current) {
          startedRef.current = true;
          const existing = list.find((c) => String(c.candidate_id) === candidateId);
          if (existing) {
            setSelectedId(existing.id);
          } else {
            try {
              const res = await conversationsApi.companyStart({
                candidate_id: Number(candidateId),
                job_offer_id: jobId ? Number(jobId) : undefined,
                subject:      "Regarding your application",
              });
              const convId = res?.data?.conversation_id;
              if (convId) {
                await fetchConversations();
                setSelectedId(convId);
              }
            } catch {
              if (list.length > 0) setSelectedId(list[0].id);
            }
          }
        } else if (list.length > 0 && !selectedId) {
          setSelectedId(list[0].id);
        }
      } finally {
        setLoadingConvs(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load messages + start polling when conversation changes
  useEffect(() => {
    if (selectedId == null) return;

    setLoadingMsgs(true);
    fetchMessages(selectedId).finally(() => setLoadingMsgs(false));

    // Poll every 4 seconds
    pollingRef.current = setInterval(() => {
      fetchMessages(selectedId);
      fetchConversations();
    }, 4000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedId, fetchMessages, fetchConversations]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const hasText = inputText.trim().length > 0;
    const hasFile = pendingFile !== null;
    if ((!hasText && !hasFile) || selectedId == null || sending) return;

    const body = inputText.trim();
    const file = pendingFile;
    setInputText("");
    setPendingFile(null);
    setSending(true);
    try {
      const r = await conversationsApi.companySend(selectedId, body, file ?? undefined);
      if (r?.data) setMessages((prev) => [...prev, r.data]);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const selected = conversations.find((c) => c.id === selectedId);

  if (loadingConvs) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="text-center py-20 text-muted-foreground">Loading…</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100vh-8rem)]"
    >
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="flex items-center justify-center flex-1 text-muted-foreground">
          No conversations yet.
        </div>
      ) : (
        <div className="flex flex-1 border border-border rounded-xl overflow-hidden bg-white min-h-0">
          {/* Conversation List */}
          <div className="w-72 border-r border-border flex flex-col shrink-0">
            <div className="overflow-y-auto flex-1">
              {conversations.map((conv) => {
                const isActive = conv.id === selectedId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors border-l-[3px] ${
                      isActive
                        ? "bg-cvision-green/10 border-l-cvision-green"
                        : "border-l-transparent hover:bg-cvision-container"
                    }`}
                  >
                    {conv.candidate_photo_url ? (
                      <img src={conv.candidate_photo_url} alt={conv.candidate_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cvision-container flex items-center justify-center text-sm font-bold shrink-0">
                        {conv.candidate_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">{conv.candidate_name}</p>
                        {conv.unread_count > 0 && (
                          <span className="ml-2 shrink-0 bg-cvision-green text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      {conv.job_title && (
                        <p className="text-xs text-cvision-green truncate">{conv.job_title}</p>
                      )}
                      {conv.last_message && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="flex flex-col flex-1 min-w-0">
            {selected ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
                  {selected.candidate_photo_url ? (
                    <img src={selected.candidate_photo_url} alt={selected.candidate_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-cvision-container flex items-center justify-center text-sm font-bold shrink-0">
                      {selected.candidate_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{selected.candidate_name}</p>
                    {selected.job_title && (
                      <p className="text-xs text-muted-foreground">{selected.job_title}</p>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
                  {loadingMsgs ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">Loading messages…</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">No messages yet. Start the conversation!</div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.sender_name !== selected.candidate_name;
                      return (
                        <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className="max-w-[70%]">
                            {!isMine && (
                              <p className="text-xs font-medium text-foreground mb-1 ml-1">{msg.sender_name}</p>
                            )}
                            <div
                              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                isMine
                                  ? "bg-cvision-green text-white rounded-br-sm"
                                  : "bg-cvision-container text-foreground rounded-bl-sm"
                              }`}
                            >
                              {msg.body && <p>{msg.body}</p>}
                              {msg.attachment_url && (
                                <a
                                  href={msg.attachment_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 mt-1 text-xs underline ${isMine ? "text-white/80" : "text-cvision-green"}`}
                                >
                                  <FileText className="w-3 h-3 shrink-0" />
                                  <span className="truncate max-w-[160px]">{msg.attachment_name ?? "Attachment"}</span>
                                  <Download className="w-3 h-3 shrink-0" />
                                </a>
                              )}
                            </div>
                            <p className={`text-xs text-muted-foreground mt-1 ${isMine ? "text-right" : "ml-1"}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Pending file preview */}
                {pendingFile && (
                  <div className="px-6 pt-2 shrink-0">
                    <div className="flex items-center gap-2 bg-cvision-container rounded-lg px-3 py-2 text-sm w-fit">
                      <FileText className="w-4 h-4 text-cvision-green" />
                      <span className="truncate max-w-[200px]">{pendingFile.name}</span>
                      <button onClick={() => setPendingFile(null)}>
                        <X className="w-3.5 h-3.5 text-muted-foreground hover:text-cvision-red" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="px-6 py-4 border-t border-border shrink-0">
                  <div className="flex items-center gap-3 bg-cvision-container rounded-xl px-4 py-2.5">
                    {/* Emoji picker */}
                    <div className="relative shrink-0" ref={emojiRef}>
                      <button
                        type="button"
                        onClick={() => setShowEmoji((v) => !v)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showEmoji ? <X className="w-4 h-4" /> : <Smile className="w-4 h-4" />}
                      </button>
                      {showEmoji && (
                        <div className="absolute bottom-8 left-0 bg-white border border-border rounded-xl p-2 shadow-lg grid grid-cols-6 gap-0.5 z-20 w-48">
                          {EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => { setInputText((prev) => prev + emoji); setShowEmoji(false); }}
                              className="text-lg hover:bg-cvision-container rounded p-1 leading-none"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* File upload */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setPendingFile(file);
                        e.target.value = "";
                      }}
                    />

                    <input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder="Type your message…"
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <Button
                      size="sm"
                      onClick={handleSend}
                      disabled={(!inputText.trim() && !pendingFile) || sending}
                      className="bg-cvision-green hover:bg-cvision-green/90 text-white rounded-lg shrink-0"
                    >
                      {sending ? "…" : "Send"}
                      <Send className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function CompanyMessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    }>
      <CompanyMessagesInner />
    </Suspense>
  );
}
