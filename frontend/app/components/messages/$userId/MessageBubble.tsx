import { useState, useRef, useEffect } from "react";
import type { MessageBubbleProps } from "~/interface/message.interface";
import { formatChatTimestamp } from "~/utils/message.utils";

export default function MessageBubble({
  message,
  isOwn,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [isBusy, setIsBusy] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(draft.length, draft.length);
    }
  }, [isEditing]);

  const handleSaveEdit = async () => {
    if (!onEdit) return;
    const next = draft.trim();
    if (!next || next === message.content) {
      setIsEditing(false);
      setDraft(message.content);
      return;
    }
    try {
      setIsBusy(true);
      await onEdit(message.id, next);
      setIsEditing(false);
    } finally {
      setIsBusy(false);
    }
  };

  const handleCancelEdit = () => {
    setDraft(message.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("Delete this message?")) return;
    try {
      setIsBusy(true);
      await onDelete(message.id);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div
      className={`group flex mb-2.5 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {/* Action buttons on the LEFT of own bubble (so they don't push it off) */}
      {isOwn && !isEditing && (onEdit || onDelete) && (
        <div className="flex items-center gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isBusy}
              aria-label="Edit message"
              className="w-7 h-7 rounded-md bg-white/[0.04] hover:bg-white/[0.10] text-[#8e8e9a] hover:text-[#f5f5f7] flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isBusy}
              aria-label="Delete message"
              className="w-7 h-7 rounded-md bg-white/[0.04] hover:bg-[#e63946]/20 text-[#8e8e9a] hover:text-[#e63946] flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          )}
        </div>
      )}

      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
          isOwn
            ? "bg-[#e63946] text-white rounded-br-md"
            : "bg-white/[0.06] text-[#f5f5f7] rounded-bl-md"
        }`}
      >
        {isEditing ? (
          <div>
            <textarea
              ref={inputRef}
              aria-label="Edit message"
              placeholder="Edit your message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit();
                } else if (e.key === "Escape") {
                  handleCancelEdit();
                }
              }}
              rows={Math.min(5, Math.max(1, draft.split("\n").length))}
              className="w-full bg-white/15 text-white placeholder-white/60 text-[13px] leading-relaxed rounded-lg px-2 py-1 outline-none border border-white/30 resize-none"
            />
            <div className="flex items-center justify-end gap-2 mt-1.5">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isBusy}
                className="text-[11px] text-white/70 hover:text-white px-2 py-0.5 rounded disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isBusy || !draft.trim()}
                className="text-[11px] bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded disabled:opacity-50"
              >
                {isBusy ? "..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}
        {!isEditing && (
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
        )}
      </div>
    </div>
  );
}
