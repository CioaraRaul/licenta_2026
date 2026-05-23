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

  // Alias-uri custom (peer renames)
  aliasByBuyer?: string | null;
  aliasBySeller?: string | null;
  /** Virtual: aliasul setat de utilizatorul curent pentru cealaltă parte */
  aliasForOther?: string | null;

  messages?: Message[];

  createdAt: string;
  updatedAt: string;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface SendMessagePayload {
  content: string;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface MessagesLayoutProps {
  conversations: Conversation[];
  currentUserId: number;
  error: boolean;
}

export interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: number;
  activeUserId?: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface ChatPanelProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: number;
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  sendError?: string | null;
  isNewConversation?: boolean;
  onEditMessage?: (id: number, content: string) => Promise<void>;
  onDeleteMessage?: (id: number) => Promise<void>;
  onRenameOther?: (alias: string | null) => Promise<void>;
  onDeleteConversation?: () => Promise<void>;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onEdit?: (id: number, content: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

export interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: number;
  isActive: boolean;
  onClick: () => void;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => void;
  autoFocus?: boolean;
}

export interface SendErrorBannerProps {
  error: string | null | undefined;
  className?: string;
}

// ─── Messages Outlet Context ─────────────────────────────────────────────────

export interface MessagesOutletContext {
  conversations: Conversation[];
  currentUserId: number;
  refreshConversations: () => Promise<void>;
}
