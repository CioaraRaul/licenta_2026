import { httpClient } from './http.api';
import type {
  Message,
  Conversation,
  SendMessagePayload,
} from '~/interface/message.interface';
import type { PaginatedResponse } from '~/interface/vehicle.interface';

/** POST /messages/vehicle/:vehicleId — pornește o conversație nouă cu seller-ul */
export async function startConversation(
  vehicleId: number,
  payload: SendMessagePayload,
): Promise<Message> {
  return httpClient.post<Message>(`/messages/vehicle/${vehicleId}`, payload);
}

/** POST /messages/:conversationId/reply — răspunde într-o conversație existentă */
export async function replyToConversation(
  conversationId: number,
  payload: SendMessagePayload,
): Promise<Message> {
  return httpClient.post<Message>(`/messages/${conversationId}/reply`, payload);
}

/** GET /messages — lista conversațiilor utilizatorului curent */
export async function getConversations(): Promise<Conversation[]> {
  return httpClient.get<Conversation[]>('/messages');
}

/** GET /messages/:conversationId — mesajele dintr-o conversație cu paginare */
export async function getConversationMessages(
  conversationId: number,
  page = 1,
  limit = 50,
): Promise<PaginatedResponse<Message>> {
  return httpClient.get<PaginatedResponse<Message>>(
    `/messages/${conversationId}`,
    { params: { page, limit } },
  );
}
