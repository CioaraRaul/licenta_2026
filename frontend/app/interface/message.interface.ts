import type { User } from "./user.interface";
import type { Vehicle } from "./vehicle.interface";

// ─── Enum ─────────────────────────────────────────────────────────────────────

export type MessageStatus = "sent" | "read";

// ─── Message entity ───────────────────────────────────────────────────────────

export interface Message {
  id: number;
  content: string;
  status: MessageStatus;

  sender: User;
  senderId: number;

  conversationId: number;

  createdAt: string;
}

// ─── Conversation entity ──────────────────────────────────────────────────────

export interface Conversation {
  id: number;

  buyer: User;
  buyerId: number;

  seller: User;
  sellerId: number;

  vehicle: Vehicle;
  vehicleId: number;

  unreadCount: number;
  lastMessage?: string;
  lastMessageAt?: string;

  messages?: Message[];

  createdAt: string;
  updatedAt: string;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface SendMessagePayload {
  content: string;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface MessagesPageData {
  conversations: Conversation[];
  currentUserId: number;
  error: boolean;
  openSellerId?: number;
  openVehicleId?: number;
}

export interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: number;
  activeConversationId: number | null;
  searchQuery: string;
  onSelectConversation: (id: number) => void;
  onSearchChange: (query: string) => void;
}

export interface ChatPanelProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: number;
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: number;
  isActive: boolean;
  onClick: () => void;
}
