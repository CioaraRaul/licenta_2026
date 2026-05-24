import { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import type { ChatPanelProps } from "~/interface/message.interface";
import {
  getOtherParticipant,
  getOtherDisplayName,
  shouldShowDateSeparator,
  getDateSeparatorLabel,
} from "~/utils/message.utils";
import { getAvatarColor, getAvatarInitials } from "~/utils/avatar.utils";
import { ChatBubbleIcon, InfoIcon } from "../icons";
import MessageBubble from "./MessageBubble";
import DateSeparator from "./DateSeparator";
import MessageInput from "./MessageInput";
import SendErrorBanner from "./SendErrorBanner";

export default function ChatPanel({
  conversation,
  messages,
  currentUserId,
  isLoading,
  onSendMessage,
  sendError,
  isNewConversation,
  onEditMessage,
  onDeleteMessage,
  onRenameOther,
  onDeleteConversation,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [aliasDraft, setAliasDraft] = useState("");
  const [busy, setBusy] = useState(false);

  /* Auto-scroll to last message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Close menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* ── New conversation mode ───────────────────────────────────────────────── */
  if (!conversation && isNewConversation) {
    return (
      <div className="flex-1 flex flex-col bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-[#e63946]/20 flex items-center justify-center text-sm font-semibold shrink-0 text-[#e63946]">
            +
          </div>
          <h3 className="text-sm font-semibold text-[#f5f5f7]">
            New Conversation
          </h3>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <ChatBubbleIcon size={32} className="text-[#8e8e9a] opacity-40 mb-3" />
          <p className="text-[#8e8e9a] text-sm text-center">
            Send your first message to the seller.
          </p>
        </div>

        <SendErrorBanner error={sendError} className="mx-4 mb-2" />
        <MessageInput onSendMessage={onSendMessage} autoFocus />
      </div>
    );
  }

  /* ── No conversation found ───────────────────────────────────────────────── */
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#141417] border border-white/[0.04] rounded-xl">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
          <ChatBubbleIcon size={32} className="text-[#8e8e9a] opacity-40" />
        </div>
        <h3 className="text-[#f5f5f7] font-medium text-base mb-1">
          No conversation found
        </h3>
        <p className="text-[#8e8e9a] text-sm text-center max-w-[260px]">
          There is no conversation with this user yet.
        </p>
      </div>
    );
  }

  const other = getOtherParticipant(conversation, currentUserId);
  const displayName = getOtherDisplayName(conversation, currentUserId);
  const hasAlias = !!conversation.aliasForOther?.trim();
  const initials = getAvatarInitials(displayName);
  const avatarBg = getAvatarColor(other.username);

  const handleStartRename = () => {
    setAliasDraft(conversation.aliasForOther || "");
    setRenaming(true);
    setMenuOpen(false);
  };

  const handleSaveAlias = async () => {
    if (!onRenameOther) return;
    try {
      setBusy(true);
      const next = aliasDraft.trim();
      await onRenameOther(next || null);
      setRenaming(false);
    } finally {
      setBusy(false);
    }
  };

  const handleClearAlias = async () => {
    if (!onRenameOther) return;
    try {
      setBusy(true);
      await onRenameOther(null);
      setRenaming(false);
      setMenuOpen(false);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteConv = async () => {
    if (!onDeleteConversation) return;
    if (!confirm(`Delete the entire conversation with ${displayName}? This cannot be undone.`))
      return;
    try {
      setBusy(true);
      await onDeleteConversation();
      setMenuOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.04]">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{ backgroundColor: avatarBg, color: "#f5f5f7" }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          {renaming ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                aria-label="Rename participant"
                placeholder={other.username}
                value={aliasDraft}
                onChange={(e) => setAliasDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveAlias();
                  if (e.key === "Escape") setRenaming(false);
                }}
                autoFocus
                disabled={busy}
                className="flex-1 bg-white/[0.06] text-[#f5f5f7] text-sm font-semibold rounded-md px-2 py-1 outline-none border border-white/10 focus:border-[#e63946]/50"
              />
              <button
                type="button"
                onClick={handleSaveAlias}
                disabled={busy}
                className="text-[11px] bg-[#e63946] hover:bg-[#e63946]/80 text-white px-2.5 py-1 rounded disabled:opacity-50"
              >
                Save
              </button>
              {hasAlias && (
                <button
                  type="button"
                  onClick={handleClearAlias}
                  disabled={busy}
                  className="text-[11px] text-[#8e8e9a] hover:text-[#f5f5f7] px-2 py-1 rounded disabled:opacity-50"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setRenaming(false)}
                disabled={busy}
                className="text-[11px] text-[#8e8e9a] hover:text-[#f5f5f7] px-2 py-1 rounded disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h3 className="text-sm font-semibold text-[#f5f5f7] truncate flex items-center gap-1.5">
              {displayName}
              {hasAlias && (
                <span
                  className="text-[10px] text-[#8e8e9a] font-normal"
                  title={`Real username: ${other.username}`}
                >
                  ({other.username})
                </span>
              )}
            </h3>
          )}
          {conversation.vehicle && !renaming && (
            <p className="text-[11px] text-[#8e8e9a] truncate">
              <Link
                to={`/find-vehicle/${conversation.vehicle.id}`}
                className="hover:text-[#f5f5f7] hover:underline"
              >
                {conversation.vehicle.make} {conversation.vehicle.model}{" "}
                {conversation.vehicle.year}
              </Link>
              {conversation.vehicle.price && (
                <span className="text-[#e63946]/70 ml-1.5">
                  ${conversation.vehicle.price.toLocaleString()}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Conversation options"
            className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center transition-colors"
          >
            <InfoIcon />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-[#1a1a1f] border border-white/[0.08] rounded-lg shadow-xl py-1 z-10">
              <button
                type="button"
                onClick={handleStartRename}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] text-[#f5f5f7] hover:bg-white/[0.06] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Rename {hasAlias ? "alias" : other.username}
              </button>
              <button
                type="button"
                onClick={handleDeleteConv}
                disabled={busy}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] text-[#e63946] hover:bg-[#e63946]/10 transition-colors disabled:opacity-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
                Delete conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
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
                  onEdit={onEditMessage}
                  onDelete={onDeleteMessage}
                />
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <SendErrorBanner error={sendError} />
      <MessageInput onSendMessage={onSendMessage} autoFocus={!isLoading} />
    </div>
  );
}
