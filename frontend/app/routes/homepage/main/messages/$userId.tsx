import { useState, useCallback } from "react";
import { useParams, useSearchParams, useOutletContext, useNavigate } from "react-router";
import type { Message, MessagesOutletContext } from "~/interface/message.interface";
import {
  deleteConversation,
  deleteMessage,
  editMessage,
  getConversationMessages,
  getConversations,
  replyToConversation,
  setConversationAlias,
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

  /* Edit own message */
  const handleEditMessage = useCallback(
    async (id: number, content: string) => {
      const updated = await editMessage(id, content);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, content: updated.content } : m,
        ),
      );
      refreshConversations();
    },
    [refreshConversations],
  );

  /* Delete own message */
  const handleDeleteMessage = useCallback(
    async (id: number) => {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      refreshConversations();
    },
    [refreshConversations],
  );

  /* Rename other participant (set alias) */
  const handleRenameOther = useCallback(
    async (alias: string | null) => {
      if (!conversation) return;
      await setConversationAlias(conversation.id, alias);
      await refreshConversations();
    },
    [conversation, refreshConversations],
  );

  /* Delete entire conversation */
  const handleDeleteConversation = useCallback(async () => {
    if (!conversation) return;
    await deleteConversation(conversation.id);
    await refreshConversations();
    navigate("/messages", { replace: true });
  }, [conversation, refreshConversations, navigate]);

  return (
    <ChatPanel
      conversation={conversation}
      messages={messages}
      currentUserId={currentUserId}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      sendError={sendError}
      isNewConversation={isNewConversation}
      onEditMessage={conversation ? handleEditMessage : undefined}
      onDeleteMessage={conversation ? handleDeleteMessage : undefined}
      onRenameOther={conversation ? handleRenameOther : undefined}
      onDeleteConversation={conversation ? handleDeleteConversation : undefined}
    />
  );
}
