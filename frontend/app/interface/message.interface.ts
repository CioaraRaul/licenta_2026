import type { User } from './user.interface';
import type { Vehicle } from './vehicle.interface';

// ─── Enum ─────────────────────────────────────────────────────────────────────

export type MessageStatus = 'sent' | 'read';

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
