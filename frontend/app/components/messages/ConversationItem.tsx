import { Link } from "react-router";
import type { ConversationItemProps } from "~/interface/message.interface";
import {
  getOtherParticipant,
  getOtherDisplayName,
  formatMessageTime,
  truncateMessage,
} from "~/utils/message.utils";
import { getAvatarColor, getAvatarInitials } from "~/utils/avatar.utils";

export default function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onClick,
}: ConversationItemProps) {
  const other = getOtherParticipant(conversation, currentUserId);
  const displayName = getOtherDisplayName(conversation, currentUserId);
  const initials = getAvatarInitials(displayName);
  // Avatar color stays tied to the real username so alias rename doesn't shuffle colors
  const avatarBg = getAvatarColor(other.username);
  const hasUnread = conversation.unreadCount > 0;

  // ── Preview text logic ────────────────────────────────────────────────────
  // - If this conversation is currently open → show the actual last message
  // - Else if I sent the last message → show "You sent"
  // - Else if I have unread messages from them → show "+N new messages"
  // - Else (read, from them) → show the last message text
  const lastMsg = conversation.lastMessage
    ? truncateMessage(conversation.lastMessage)
    : "No messages yet";
  const sentByMe = conversation.lastMessageSenderId === currentUserId;
  let previewText: string;
  if (isActive) {
    previewText = lastMsg;
  } else if (sentByMe) {
    previewText = "You sent";
  } else if (hasUnread) {
    previewText = `+${conversation.unreadCount} new message${conversation.unreadCount === 1 ? "" : "s"}`;
  } else {
    previewText = lastMsg;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
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
            title={
              displayName !== other.username
                ? `Real username: ${other.username}`
                : undefined
            }
          >
            {displayName}
          </span>
          {conversation.lastMessageAt && (
            <span className="text-[11px] text-[#555] shrink-0">
              {formatMessageTime(conversation.lastMessageAt)}
            </span>
          )}
        </div>

        {/* Vehicle */}
        {conversation.vehicle && (
          <Link
            to={`/find-vehicle/${conversation.vehicle.id}`}
            onClick={(e) => e.stopPropagation()}
            className="block text-[11px] text-[#e63946]/70 hover:text-[#e63946] hover:underline truncate mt-0.5"
          >
            {conversation.vehicle.make} {conversation.vehicle.model}{" "}
            {conversation.vehicle.year}
          </Link>
        )}

        {/* Last message preview + unread badge */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={`text-xs truncate ${
              hasUnread && !isActive && !sentByMe
                ? "text-[#e63946] font-medium"
                : sentByMe && !isActive
                  ? "text-[#8e8e9a] italic"
                  : hasUnread
                    ? "text-[#c5c5c7]"
                    : "text-[#8e8e9a]"
            }`}
          >
            {previewText}
          </p>
          {hasUnread && !isActive && !sentByMe && (
            <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-[#e63946] text-[10px] text-white font-semibold flex items-center justify-center px-1">
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
