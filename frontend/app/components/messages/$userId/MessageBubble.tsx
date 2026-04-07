import type { MessageBubbleProps } from "~/interface/message.interface";
import { formatChatTimestamp } from "~/utils/message.utils";

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
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
              {message.status === "read" ? "\u2713\u2713" : "\u2713"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
