import { useNavigate } from "react-router";
import type { ConversationListProps } from "~/interface/message.interface";
import { filterConversations, getOtherParticipant } from "~/utils/message.utils";
import { SearchIcon, EmptyInboxIcon } from "./icons";
import ConversationItem from "./ConversationItem";

export default function ConversationList({
  conversations,
  currentUserId,
  activeUserId,
  searchQuery,
  onSearchChange,
}: ConversationListProps) {
  const navigate = useNavigate();
  const filtered = filterConversations(conversations, searchQuery, currentUserId);

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
          filtered.map((conv) => {
            const other = getOtherParticipant(conv, currentUserId);
            return (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                currentUserId={currentUserId}
                isActive={other.id === activeUserId}
                onClick={() => navigate(`/messages/${other.id}`)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
