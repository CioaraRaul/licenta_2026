import type { Conversation } from "~/interface/message.interface";
import type { User } from "~/interface/user.interface";

/**
 * Returnează celălalt participant dintr-o conversație.
 * Dacă currentUserId === buyerId → returnează seller, altfel buyer.
 */
export function getOtherParticipant(
  conversation: Conversation,
  currentUserId: number,
): User {
  return conversation.buyerId === currentUserId
    ? conversation.seller
    : conversation.buyer;
}

/**
 * Numele afișat pentru celălalt participant — alias-ul setat de utilizatorul curent
 * sau username-ul real dacă nu există alias.
 */
export function getOtherDisplayName(
  conversation: Conversation,
  currentUserId: number,
): string {
  const other = getOtherParticipant(conversation, currentUserId);
  return conversation.aliasForOther?.trim() || other.username;
}

/**
 * Formatează timestamp-ul pentru lista de conversații.
 * - Azi    → "14:32"
 * - Ieri   → "Yesterday"
 * - Săptămâna asta → "Mon", "Tue" etc.
 * - Mai vechi → "Jan 5"
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  if (diffDays === 1) return "Yesterday";

  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Formatează timestamp-ul complet pentru un mesaj din chat.
 * "14:32" (azi) sau "Jan 5, 14:32" (alte zile)
 */
export function formatChatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isToday) return time;

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${dateStr}, ${time}`;
}

/**
 * Trunchiază un mesaj la un număr maxim de caractere.
 */
export function truncateMessage(message: string, maxLength = 45): string {
  if (message.length <= maxLength) return message;
  return message.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Filtrează conversațiile pe baza unui query (caută în username-ul celuilalt
 * participant, make/model vehicul și ultimul mesaj).
 */
export function filterConversations(
  conversations: Conversation[],
  query: string,
  currentUserId: number,
): Conversation[] {
  if (!query.trim()) return conversations;

  const q = query.toLowerCase();

  return conversations.filter((conv) => {
    const displayName = getOtherDisplayName(conv, currentUserId).toLowerCase();
    const vehicleInfo =
      `${conv.vehicle?.make ?? ""} ${conv.vehicle?.model ?? ""}`.toLowerCase();
    const lastMsg = conv.lastMessage?.toLowerCase() ?? "";

    return (
      displayName.includes(q) || vehicleInfo.includes(q) || lastMsg.includes(q)
    );
  });
}

/**
 * Verifică dacă între două mesaje consecutive trebuie afișat un separator de dată.
 */
export function shouldShowDateSeparator(
  currentDate: string,
  previousDate?: string,
): boolean {
  if (!previousDate) return true;

  const curr = new Date(currentDate);
  const prev = new Date(previousDate);

  return (
    curr.getDate() !== prev.getDate() ||
    curr.getMonth() !== prev.getMonth() ||
    curr.getFullYear() !== prev.getFullYear()
  );
}

/**
 * Returnează label-ul separatorului de dată.
 */
export function getDateSeparatorLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
