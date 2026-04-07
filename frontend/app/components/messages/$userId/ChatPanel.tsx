import { useRef, useEffect } from "react";
import type { ChatPanelProps } from "~/interface/message.interface";
import { getOtherParticipant, shouldShowDateSeparator, getDateSeparatorLabel } from "~/utils/message.utils";
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
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to last message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
  const initials = getAvatarInitials(other.username);
  const avatarBg = getAvatarColor(other.username);

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
