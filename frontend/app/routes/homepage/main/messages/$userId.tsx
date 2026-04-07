import { useState, useCallback } from "react";
import { useParams, useSearchParams, useOutletContext, useNavigate } from "react-router";
import type { Message, MessagesOutletContext } from "~/interface/message.interface";
import {
  getConversationMessages,
  getConversations,
  replyToConversation,
  startConversation,
} from "~/api/messages.api";
import { getOtherParticipant } from "~/utils/message.utils";
import ChatPanel from "~/components/messages/$userId/ChatPanel";

export default function MessageUser() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { conversations, currentUserId, refreshConversations } =
    useOutletContext<MessagesOutletContext>();

  const targetUserId = Number(userId);
  const vehicleId = searchParams.get("vehicleId")
    ? Number(searchParams.get("vehicleId"))
    : undefined;

  /* Find the matching conversation for this user */
  const conversation =
    conversations.find((c) => {
      const other = getOtherParticipant(c, currentUserId);
      return other.id === targetUserId;
    }) ?? null;

  const isNewConversation = !conversation && !!vehicleId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [loadedConversationId, setLoadedConversationId] = useState<number | null>(null);

  /* Load messages when conversation changes */
  if (conversation && conversation.id !== loadedConversationId) {
    setLoadedConversationId(conversation.id);
    setIsLoading(true);
    getConversationMessages(conversation.id, 1, 100)
      .then((result) => {
        setMessages(result.data);
        refreshConversations();
      })
      .catch(() => setMessages([]))
      .finally(() => setIsLoading(false));
  }

  /* Send message handler */
  const handleSendMessage = useCallback(
    async (content: string) => {
      setSendError(null);

      // New conversation — use startConversation API
      if (isNewConversation && vehicleId) {
        try {
          await startConversation(vehicleId, { content });
          const updated = await getConversations();
          await refreshConversations();
          const newConv = updated.find((c) => c.vehicleId === vehicleId);
          if (newConv) {
            const other = getOtherParticipant(newConv, currentUserId);
            navigate(`/messages/${other.id}`, { replace: true });
          }
        } catch (err: any) {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to start conversation. Please try again.";
          setSendError(msg);
        }
        return;
      }

      if (!conversation) return;
      try {
        const newMessage = await replyToConversation(conversation.id, {
          content,
        });
        setMessages((prev) => [
          ...prev,
          { ...newMessage, sender: { id: currentUserId } as any },
        ]);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to send message. Please try again.";
        setSendError(msg);
      }
    },
    [conversation, isNewConversation, vehicleId, currentUserId, navigate, refreshConversations],
  );

  return (
    <ChatPanel
      conversation={conversation}
      messages={messages}
      currentUserId={currentUserId}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      sendError={sendError}
      isNewConversation={isNewConversation}
    />
  );
}
