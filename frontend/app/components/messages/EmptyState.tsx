import { ChatBubbleIcon } from "./icons";

export default function EmptyState() {
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
