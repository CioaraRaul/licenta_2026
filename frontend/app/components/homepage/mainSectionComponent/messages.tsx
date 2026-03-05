import { useState, useRef, useEffect, useCallback } from "react";
import {
  getConversationMessages,
  replyToConversation,
} from "~/api/messages.api";
import type {
  MessagesPageData,
  Conversation,
  Message,
  ConversationListProps,
  ChatPanelProps,
  MessageBubbleProps,
  ConversationItemProps,
} from "~/interface/message.interface";
import {
  getOtherParticipant,
  formatMessageTime,
  formatChatTimestamp,
  truncateMessage,
  filterConversations,
  shouldShowDateSeparator,
  getDateSeparatorLabel,
} from "~/utils/message.utils";
import { getAvatarColor, getAvatarInitials } from "~/utils/avatar.utils";

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT — orchestrează starea, încarcă mesaje, trimite reply-uri
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function MessagesComponent({
  conversations,
  currentUserId,
  error,
}: MessagesPageData) {
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? null;

  /* ── Încarcă mesajele când user-ul selectează o conversație ──────────────── */
  const loadMessages = useCallback(async (conversationId: number) => {
    setIsLoadingMessages(true);
    try {
      const result = await getConversationMessages(conversationId, 1, 100);
      setMessages(result.data);
    } catch {
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const handleSelectConversation = useCallback(
    (id: number) => {
      setActiveConversationId(id);
      loadMessages(id);
    },
    [loadMessages],
  );

  /* ── Trimite un mesaj nou într-o conversație ────────────────────────────── */
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!activeConversationId) return;
      try {
        const newMessage = await replyToConversation(activeConversationId, {
          content,
        });
        setMessages((prev) => [
          ...prev,
          { ...newMessage, sender: { userId: currentUserId } as any },
        ]);
      } catch {
        // silently fail — TODO: toast notification
      }
    },
    [activeConversationId, currentUserId],
  );

  /* ── Error state ────────────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-10 text-center">
            <ErrorIcon />
            <p className="text-[#8e8e9a] text-sm">
              Failed to load messages. Please refresh.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-[1200px] mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-5">
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
            Messages
          </h1>
          <p className="text-sm text-[#8e8e9a] mt-1">
            {conversations.length} conversation
            {conversations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Dual-panel layout */}
        <div className="flex-1 min-h-0 flex gap-4">
          <ConversationList
            conversations={conversations}
            currentUserId={currentUserId}
            activeConversationId={activeConversationId}
            searchQuery={searchQuery}
            onSelectConversation={handleSelectConversation}
            onSearchChange={setSearchQuery}
          />
          <ChatPanel
            conversation={activeConversation}
            messages={messages}
            currentUserId={currentUserId}
            isLoading={isLoadingMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CONVERSATION LIST — panoul din stânga cu lista de conversații
   ═══════════════════════════════════════════════════════════════════════════════ */

function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
  searchQuery,
  onSelectConversation,
  onSearchChange,
}: ConversationListProps) {
  const filtered = filterConversations(
    conversations,
    searchQuery,
    currentUserId,
  );

  return (
    <div className="w-[340px] shrink-0 flex flex-col bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-white/[0.04]">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8e9a]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/40 transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-10">
            <EmptyInboxIcon />
            <p className="text-[#8e8e9a] text-sm mt-3 text-center">
              {searchQuery
                ? "No conversations match your search."
                : "No conversations yet."}
            </p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              currentUserId={currentUserId}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CONVERSATION ITEM — un rând din lista de conversații
   ═══════════════════════════════════════════════════════════════════════════════ */

function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onClick,
}: ConversationItemProps) {
  const other = getOtherParticipant(conversation, currentUserId);
  const initials = getAvatarInitials(other.username);
  const avatarBg = getAvatarColor(other.username);
  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all border-b border-white/[0.03] hover:bg-white/[0.03] cursor-pointer ${
        isActive ? "bg-white/[0.06] border-l-2 border-l-[#e63946]" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
        style={{ backgroundColor: avatarBg, color: "#f5f5f7" }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm truncate ${
              hasUnread
                ? "font-semibold text-[#f5f5f7]"
                : "font-medium text-[#c5c5c7]"
            }`}
          >
            {other.username}
          </span>
          {conversation.lastMessageAt && (
            <span className="text-[11px] text-[#555] shrink-0">
              {formatMessageTime(conversation.lastMessageAt)}
            </span>
          )}
        </div>

        {/* Vehicul */}
        {conversation.vehicle && (
          <p className="text-[11px] text-[#e63946]/70 truncate mt-0.5">
            {conversation.vehicle.make} {conversation.vehicle.model}{" "}
            {conversation.vehicle.year}
          </p>
        )}

        {/* Ultimul mesaj + badge unread */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={`text-xs truncate ${
              hasUnread ? "text-[#c5c5c7]" : "text-[#8e8e9a]"
            }`}
          >
            {conversation.lastMessage
              ? truncateMessage(conversation.lastMessage)
              : "No messages yet"}
          </p>
          {hasUnread && (
            <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-[#e63946] text-[10px] text-white font-semibold flex items-center justify-center px-1">
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CHAT PANEL — panoul din dreapta cu mesaje + input
   ═══════════════════════════════════════════════════════════════════════════════ */

function ChatPanel({
  conversation,
  messages,
  currentUserId,
  isLoading,
  onSendMessage,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll la ultimul mesaj */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  /* ── Empty state (nicio conversație selectată) ──────────────────────────── */
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#141417] border border-white/[0.04] rounded-xl">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
          <ChatBubbleIcon size={32} className="text-[#8e8e9a] opacity-40" />
        </div>
        <h3 className="text-[#f5f5f7] font-medium text-base mb-1">
          Select a conversation
        </h3>
        <p className="text-[#8e8e9a] text-sm text-center max-w-[260px]">
          Choose a conversation from the list to start messaging.
        </p>
      </div>
    );
  }

  const other = getOtherParticipant(conversation, currentUserId);
  const initials = getAvatarInitials(other.username);
  const avatarBg = getAvatarColor(other.username);

  return (
    <div className="flex-1 flex flex-col bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
      {/* ── Chat Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.04]">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{ backgroundColor: avatarBg, color: "#f5f5f7" }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#f5f5f7] truncate">
            {other.username}
          </h3>
          {conversation.vehicle && (
            <p className="text-[11px] text-[#8e8e9a] truncate">
              {conversation.vehicle.make} {conversation.vehicle.model}{" "}
              {conversation.vehicle.year}
              {conversation.vehicle.price && (
                <span className="text-[#e63946]/70 ml-1.5">
                  ${conversation.vehicle.price.toLocaleString()}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center transition-colors">
            <InfoIcon />
          </button>
        </div>
      </div>

      {/* ── Messages Area ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#8e8e9a] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-[#8e8e9a] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-[#8e8e9a] rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-[#8e8e9a] text-sm">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const showDate = shouldShowDateSeparator(
              msg.createdAt,
              messages[idx - 1]?.createdAt,
            );
            return (
              <div key={msg.id}>
                {showDate && (
                  <DateSeparator label={getDateSeparatorLabel(msg.createdAt)} />
                )}
                <MessageBubble
                  message={msg}
                  isOwn={msg.senderId === currentUserId}
                />
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ───────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-white/[0.04] flex items-end gap-3"
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-[#f5f5f7] placeholder-[#555] outline-none resize-none min-h-[40px] max-h-[120px] focus:border-[#e63946]/40 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="shrink-0 w-10 h-10 rounded-xl bg-[#e63946] hover:bg-[#d62836] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MESSAGE BUBBLE — un mesaj individual în chat
   ═══════════════════════════════════════════════════════════════════════════════ */

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex mb-2.5 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
          isOwn
            ? "bg-[#e63946] text-white rounded-br-md"
            : "bg-white/[0.06] text-[#f5f5f7] rounded-bl-md"
        }`}
      >
        <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <div
          className={`flex items-center gap-1.5 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-[10px] ${isOwn ? "text-white/60" : "text-[#555]"}`}
          >
            {formatChatTimestamp(message.createdAt)}
          </span>
          {isOwn && (
            <span className="text-[10px] text-white/50">
              {message.status === "read" ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DATE SEPARATOR — separator vizual între zile diferite
   ═══════════════════════════════════════════════════════════════════════════════ */

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-[11px] text-[#555] font-medium shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SVG ICONS — inline pentru a nu depinde de librării externe
   ═══════════════════════════════════════════════════════════════════════════════ */

function ErrorIcon() {
  return (
    <svg
      className="mx-auto mb-4 opacity-30"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8e8e9a"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function EmptyInboxIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8e8e9a"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-30"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ChatBubbleIcon({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8e8e9a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
