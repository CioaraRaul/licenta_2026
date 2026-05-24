import { useState, useCallback } from "react";
import { Outlet, useParams } from "react-router";
import type { MessagesLayoutProps, MessagesOutletContext } from "~/interface/message.interface";
import { getConversations } from "~/api/messages.api";
import { ErrorIcon } from "./icons";
import ConversationList from "./ConversationList";

export default function MessagesLayout({
  conversations: initialConversations,
  currentUserId,
  error,
}: MessagesLayoutProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useParams();
  const activeUserId = userId ? Number(userId) : undefined;

  const refreshConversations = useCallback(async () => {
    try {
      const updated = await getConversations();
      setConversations(updated);
    } catch {
      /* keep current */
    }
  }, []);

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

  const context: MessagesOutletContext = {
    conversations,
    currentUserId,
    refreshConversations,
  };

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
            activeUserId={activeUserId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <Outlet context={context} />
        </div>
      </div>
    </div>
  );
}
