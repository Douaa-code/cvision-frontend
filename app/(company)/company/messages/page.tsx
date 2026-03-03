"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockCompanyConversations, type Conversation } from "@/lib/mock-data/messages";

export default function CompanyMessagesPage() {
  const [selectedId, setSelectedId] = useState(mockCompanyConversations[0].id);
  const [inputText, setInputText] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(mockCompanyConversations);

  const selected = conversations.find((c) => c.id === selectedId)!;

  const handleSend = () => {
    if (!inputText.trim()) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  sender: "company" as const,
                  text: inputText.trim(),
                  time: "Just now",
                },
              ],
            }
          : c
      )
    );
    setInputText("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100vh-8rem)]"
    >
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="flex flex-1 border border-border rounded-xl overflow-hidden bg-white min-h-0">
        {/* Left: Conversation List */}
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
                  <div className="w-10 h-10 rounded-full bg-cvision-container flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                    {conv.candidateName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{conv.candidateName}</p>
                    <p className="text-xs text-cvision-green truncate">{conv.jobTitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
            <div className="w-10 h-10 rounded-full bg-cvision-container flex items-center justify-center text-sm font-bold shrink-0">
              {selected.candidateName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm">{selected.candidateName}</p>
              <p className="text-xs text-muted-foreground">{selected.jobTitle}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
            {/* Date separator */}
            <div className="flex justify-center">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground bg-cvision-container px-3 py-1 rounded-full">
                {selected.dateSeparator}
              </span>
            </div>

            {selected.messages.map((msg) => {
              const isCompany = msg.sender === "company";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isCompany ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[70%]">
                    {!isCompany && (
                      <p className="text-xs font-medium text-foreground mb-1 ml-1">
                        {selected.candidateName}
                      </p>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isCompany
                          ? "bg-cvision-green text-white rounded-br-sm"
                          : "bg-cvision-container text-foreground rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p
                      className={`text-xs text-muted-foreground mt-1 ${
                        isCompany ? "text-right" : "ml-1"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-border shrink-0">
            <div className="flex items-center gap-3 bg-cvision-container rounded-xl px-4 py-2.5">
              <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <Smile className="w-4 h-4" />
              </button>
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-cvision-green hover:bg-cvision-green/90 text-white rounded-lg shrink-0"
              >
                Send
                <Send className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
